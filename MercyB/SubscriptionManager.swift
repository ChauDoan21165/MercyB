/**
 * MercyB: Subscription Manager (StoreKit 2 Engine)
 * Path: MercyB/SubscriptionManager.swift
 * Strategy: Secure IAP handling for CAD/VND settlement with Supabase sync readiness.
 * Protocol V4.0: Full Fixed File.
 */

import Foundation
import StoreKit

@MainActor
class SubscriptionManager: ObservableObject {
    
    // --- 🔐 GLOBAL ENTITLEMENT STATE ---
    @Published private(set) var isVip: Bool = false
    @Published private(set) var userTier: Int = 0 // 0: Free, 1: Pro, 2: Elite
    @Published private(set) var products: [Product] = []
    @Published private(set) var purchasedProductIDs = Set<String>()
    
    private var updateListenerTask: Task<Void, Error>? = nil
    
    // Replace these with your actual App Store Connect Identifiers
    private let productIDs = [
        "com.mercyb.pro.monthly",
        "com.mercyb.pro.yearly",
        "com.mercyb.elite.yearly"
    ]

    init() {
        // Start listening for background transactions immediately
        updateListenerTask = listenForTransactions()
        
        Task {
            await fetchProducts()
            await updateCustomerProductStatus()
        }
    }

    deinit {
        updateListenerTask?.cancel()
    }

    // MARK: - 🛒 FETCH PRODUCTS
    func fetchProducts() async {
        do {
            let storeProducts = try await Product.products(for: productIDs)
            self.products = storeProducts.sorted(by: { $0.price < $1.price })
        } catch {
            print("❌ StoreKit: Failed to fetch products: \(error)")
        }
    }

    // MARK: - 💳 PURCHASE LOGIC (The "Buy" Button)
    func purchase(_ product: Product) async throws {
        let result = try await product.purchase()
        
        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            
            // 1. Update UI
            await updateCustomerProductStatus()
            
            // 2. Finalize Transaction
            await transaction.finish()
            
            // 3. TODO: Sync with Supabase for cross-platform (Web/Android)
            // syncWithBackend(transaction)
            
        case .userCancelled:
            print("⚠️ User cancelled the purchase.")
        case .pending:
            print("⏳ Transaction pending (Parental Approval).")
        @unknown default:
            break
        }
    }

    // MARK: - 🛡️ VERIFICATION & STATUS
    func updateCustomerProductStatus() async {
        var purchasedIDs = Set<String>()
        
        // Iterate through all current active entitlements
        for await result in Transaction.currentEntitlements {
            do {
                let transaction = try checkVerified(result)
                purchasedIDs.insert(transaction.productID)
                
                // Determine Tier Logic
                if transaction.productID.contains("elite") {
                    self.userTier = 2
                } else if transaction.productID.contains("pro") {
                    self.userTier = 1
                }
            } catch {
                print("❌ StoreKit: Verification failed for entitlement.")
            }
        }
        
        self.purchasedProductIDs = purchasedIDs
        self.isVip = !purchasedIDs.isEmpty
    }

    func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified:
            throw StoreError.failedVerification
        case .verified(let safe):
            return safe
        }
    }

    private func listenForTransactions() -> Task<Void, Error> {
        return Task.detached {
            for await result in Transaction.updates {
                do {
                    let transaction = try await self.checkVerified(result)
                    await self.updateCustomerProductStatus()
                    await transaction.finish()
                } catch {
                    print("❌ StoreKit: Background update failed.")
                }
            }
        }
    }
}

// MARK: - 🛠️ ERRORS
enum StoreError: Error {
    case failedVerification
}