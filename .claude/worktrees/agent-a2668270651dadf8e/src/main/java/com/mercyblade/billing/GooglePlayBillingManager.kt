package com.mercyblade.billing

import android.app.Activity
import android.util.Log
import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryPurchasesParams
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class GooglePlayBillingManager(
    private val activity: Activity,
    private val supabaseUrl: String,
    private val supabaseJwtProvider: () -> String,
    private val appUserIdProvider: () -> String,
    private val onEntitlementRefreshRequired: () -> Unit,
    private val onError: (String) -> Unit = { Log.e(TAG, it) },
) : PurchasesUpdatedListener {

    private val billingClient: BillingClient = BillingClient.newBuilder(activity)
        .enablePendingPurchases()
        .setListener(this)
        .build()

    private val httpClient = OkHttpClient()

    fun start() {
        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(billingResult: BillingResult) {
                if (billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
                    onError("Billing setup failed: ${billingResult.debugMessage}")
                }
            }

            override fun onBillingServiceDisconnected() {
                onError("Billing service disconnected")
            }
        })
    }

    fun launchSubscriptionPurchase(
        productId: String,
        offerToken: String? = null,
    ) {
        val product = QueryProductDetailsParams.Product.newBuilder()
            .setProductId(productId)
            .setProductType(BillingClient.ProductType.SUBS)
            .build()

        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(listOf(product))
            .build()

        billingClient.queryProductDetailsAsync(params) { billingResult, productDetailsList ->
            if (billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
                onError("queryProductDetails failed: ${billingResult.debugMessage}")
                return@queryProductDetailsAsync
            }

            val productDetails = productDetailsList.firstOrNull()
            if (productDetails == null) {
                onError("No ProductDetails found for $productId")
                return@queryProductDetailsAsync
            }

            launchBillingFlow(productDetails, offerToken)
        }
    }

    private fun launchBillingFlow(
        productDetails: ProductDetails,
        explicitOfferToken: String?,
    ) {
        val chosenOfferToken = explicitOfferToken
            ?: productDetails.subscriptionOfferDetails
                ?.firstOrNull()
                ?.offerToken

        if (chosenOfferToken.isNullOrBlank()) {
            onError("No offerToken found for ${productDetails.productId}")
            return
        }

        val productDetailsParams =
            BillingFlowParams.ProductDetailsParams.newBuilder()
                .setProductDetails(productDetails)
                .setOfferToken(chosenOfferToken)
                .build()

        val billingFlowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(listOf(productDetailsParams))
            .setObfuscatedAccountId(appUserIdProvider())
            .build()

        val result = billingClient.launchBillingFlow(activity, billingFlowParams)
        if (result.responseCode != BillingClient.BillingResponseCode.OK) {
            onError("launchBillingFlow failed: ${result.debugMessage}")
        }
    }

    override fun onPurchasesUpdated(
        billingResult: BillingResult,
        purchases: MutableList<Purchase>?,
    ) {
        when (billingResult.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                val purchaseList = purchases ?: emptyList()
                for (purchase in purchaseList) {
                    handlePurchase(purchase)
                }
            }

            BillingClient.BillingResponseCode.USER_CANCELED -> {
                Log.d(TAG, "User canceled purchase flow")
            }

            else -> {
                onError("onPurchasesUpdated failed: ${billingResult.debugMessage}")
            }
        }
    }

    fun restorePurchases() {
        val params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.SUBS)
            .build()

        billingClient.queryPurchasesAsync(params) { billingResult, purchases ->
            if (billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
                onError("restorePurchases failed: ${billingResult.debugMessage}")
                return@queryPurchasesAsync
            }

            for (purchase in purchases) {
                handlePurchase(purchase)
            }
        }
    }

    private fun handlePurchase(purchase: Purchase) {
        if (purchase.purchaseState != Purchase.PurchaseState.PURCHASED) {
            Log.d(TAG, "Ignoring non-purchased state for token=${purchase.purchaseToken}")
            return
        }

        val purchaseToken = purchase.purchaseToken
        val productId = purchase.products.firstOrNull()

        if (purchaseToken.isBlank() || productId.isNullOrBlank()) {
            onError("Missing purchaseToken or productId")
            return
        }

        Log.d(TAG, "Google purchase success token=$purchaseToken productId=$productId")

        // Do not unlock premium locally.
        // Always sync to backend first, then refresh entitlement.
        syncPurchaseToBackend(
            purchaseToken = purchaseToken,
            productId = productId,
            packageName = activity.packageName,
        )
    }

    private fun syncPurchaseToBackend(
        purchaseToken: String,
        productId: String,
        packageName: String,
    ) {
        Thread {
            try {
                val body = JSONObject()
                    .put("appUserId", appUserIdProvider())
                    .put("purchaseToken", purchaseToken)
                    .put("productId", productId)
                    .put("packageName", packageName)
                    .toString()

                val request = Request.Builder()
                    .url("$supabaseUrl/functions/v1/billing-google-attach-purchase")
                    .addHeader("Authorization", "Bearer ${supabaseJwtProvider()}")
                    .addHeader("Content-Type", "application/json")
                    .post(body.toRequestBody("application/json".toMediaType()))
                    .build()

                httpClient.newCall(request).execute().use { response ->
                    val responseBody = response.body?.string().orEmpty()
                    Log.d(TAG, "billing-google-attach-purchase: ${response.code} $responseBody")

                    if (!response.isSuccessful) {
                        onError("Backend sync failed: ${response.code} $responseBody")
                        return@use
                    }

                    // Backend is the source of truth.
                    // Refresh entitlement after backend sync succeeds.
                    activity.runOnUiThread {
                        onEntitlementRefreshRequired()
                    }
                }
            } catch (e: IOException) {
                onError("Network error during backend sync: ${e.message}")
            } catch (e: Exception) {
                onError("Unexpected backend sync error: ${e.message}")
            }
        }.start()
    }

    fun acknowledgeIfNeeded(
        purchase: Purchase,
        onDone: (() -> Unit)? = null,
    ) {
        if (purchase.isAcknowledged) {
            onDone?.invoke()
            return
        }

        val params = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchase.purchaseToken)
            .build()

        billingClient.acknowledgePurchase(params) { billingResult ->
            if (billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
                onError("acknowledgePurchase failed: ${billingResult.debugMessage}")
                return@acknowledgePurchase
            }
            onDone?.invoke()
        }
    }

    fun end() {
        billingClient.endConnection()
    }

    companion object {
        private const val TAG = "GooglePlayBilling"
    }
}