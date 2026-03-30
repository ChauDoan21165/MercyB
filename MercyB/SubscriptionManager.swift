/**
 * MercyB: Subscription Manager (Continuity Guard)
 * Path: MercyB/SubscriptionManager.swift
 * Strategy: Real-time Lifecycle Synchronization (SOP V4.0).
 * Logic: Persistent background task to catch Refunds/Revocations instantly.
 */

import Foundation
import StoreKit

@MainActor
class SubscriptionManager: ObservableObject {
    
    static let shared = SubscriptionManager()
    
    // The "Source of Truth" for the UI (ContentView.swift)
    @Published var isPremium: Bool = false
    @Published var activeProducts: [Product] = []
    
    private var updateListenerTask: Task<Void, Never>? = nil
    private let premiumProductID = "com.mercyblade.premium"

    init() {
        // 1. START THE CONTINUITY GUARD
        // This listens for transactions that happen while the app is active or in background.
        updateListenerTask = listenForTransactions()
        
        // 2. THE "NEXT LAUNCH" SYNC
        // Critical: Ensures that if a refund happened while the app was CLOSED, 
        // the entitlement is revoked immediately upon opening.
        Task {
            await updateSubscriptionStatus()
        }
    }

    deinit {
        updateListenerTask?.cancel()
    }

    // --- REAL-TIME ENTITLEMENT SYNC ---

    /**
     * Re-validates all current entitlements against Apple's local receipt/StoreKit 2 cache.
     */
    func updateSubscriptionStatus() async {
        var hasActivePremium = false
        
        // Transaction.currentEntitlements only includes verified, non-revoked, non-expired items.
        for await result in Transaction.currentEntitlements {
            do {
                let transaction = try checkVerified(result)
                
                if transaction.productID == premiumProductID {
                    // Final safety check: ensure no revocation date exists
                    if transaction.revocationDate == nil && (transaction.expirationDate ?? .distantFuture) > .now {
                        hasActivePremium = true
                    }
                }
            } catch {
                print("⚠️ [StoreKit Specialist] Entitlement Verification Failed: \(error)")
            }
        }
        
        // Update the UI state. If false, the UI Engineer's logic will instantly lock the PremiumDashboard.
        if self.isPremium != hasActivePremium {
            self.isPremium = hasActivePremium
            print("🔄 [StoreKit Specialist] Entitlement Change: isPremium set to \(hasActivePremium)")
        }
    }

    // --- THE BACKGROUND LISTENER (THE GUARD) ---

    /**
     * Listens for asynchronous updates from Apple (Refunds, Family Sharing changes, Renewals).
     */
    private func listenForTransactions() -> Task<Void, Never> {
        return Task.detached {
            for await result in Transaction.updates {
                do {
                    // 1. Verify the transaction cryptographically
                    let transaction = try await self.checkVerified(result)
                    
                    // 2. Refresh the local state on the Main Actor
                    await MainActor.run {
                        Task {
                            await self.updateSubscriptionStatus()
                        }
                    }
                    
                    // 3. Inform Team Member C's backend if it's a revocation
                    if transaction.revocationDate != nil {
                        print("🚨 [StoreKit Specialist] REVOCATION DETECTED: Notifying Backend...")
                        // Sync call to Supabase apple-iap-sync would go here
                    }
                    
                    // 4. ALWAYS FINISH: Tells Apple we have successfully processed the update.
                    await transaction.finish()
                    
                } catch {
                    print("❌ [StoreKit Specialist] Transaction Update Error: \(error)")
                }
            }
        }
    }

    // --- PURCHASE INTERFACE ---

    func purchasePremium() {
        Task {
            do {
                try await AppleSubscriptionService.shared.purchase()
                await updateSubscriptionStatus()
            } catch {
                print("❌ [StoreKit Specialist] Purchase Flow Failed: \(error.localizedDescription)")
            }
        }
    }

    // --- SECURITY UTILS ---

    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            // Safety-First: Reject any transaction that fails cryptographic signature verification.
            throw error
        case .verified(let safe):
            return safe
        }
    }
}