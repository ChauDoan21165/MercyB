/**
 * MercyB: Main Content View Hub
 * Path: MercyB/ContentView.swift
 * Strategy: High-level routing and state management for User Entitlements.
 * Integration: Team Member C (Backend Sync) + V4.0 Protocol.
 */

import SwiftUI
import StoreKit

struct ContentView: View {
    // Shared state managed by the SubscriptionManager singleton
    @StateObject private var subscriptionManager = SubscriptionManager.shared
    @State private var selectedTab = 0

    var body: some View {
        Group {
            // THE UI SWAP: Logical branch based on verified premium status
            if subscriptionManager.isPremium {
                // MISSION: Transition to the Premium Experience
                TabView(selection: $selectedTab) {
                    PremiumDashboardView()
                        .tabItem {
                            Label("Pro Home", systemImage: "crown.fill")
                        }
                        .tag(0)

                    SettingsView()
                        .tabItem {
                            Label("Settings", systemImage: "gear")
                        }
                        .tag(1)
                }
                .transition(.asymmetric(
                    insertion: .move(edge: .trailing).combined(with: .opacity),
                    removal: .opacity
                ))
            } else {
                // STANDARD FREEMIUM FLOW
                TabView(selection: $selectedTab) {
                    HomeView()
                        .tabItem {
                            Label("Home", systemImage: "house.fill")
                        }
                        .tag(0)

                    SettingsView()
                        .tabItem {
                            Label("Settings", systemImage: "gear")
                        }
                        .tag(1)
                }
                .transition(.opacity)
            }
        }
        .animation(.spring(response: 0.6, dampingFraction: 0.8), value: subscriptionManager.isPremium)
        .onAppear {
            // Initial check for active subscriptions on app launch
            Task {
                await subscriptionManager.updateSubscriptionStatus()
            }
        }
    }
}

// MARK: - Subscription Manager (StoreKit 2 + Supabase Bridge)
class SubscriptionManager: ObservableObject {
    static let shared = SubscriptionManager()
    
    @Published var isPremium: Bool = false
    private let supabaseSyncUrl = URL(string: "https://[PROJECT_ID].supabase.co/functions/v1/apple-iap-sync")!

    @MainActor
    func updateSubscriptionStatus() async {
        // 1. Local Check (Fail-Open): Check StoreKit 2 for valid entitlements
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result {
                if transaction.productID == "com.mercyblade.premium" {
                    // Instantly unlock locally to prevent stalling (MercyB Blue Philosophy)
                    self.isPremium = true
                    
                    // 2. Remote Sync: Hardens the backend source of truth
                    await syncWithSupabase(transactionId: String(transaction.id))
                    return
                }
            }
        }
    }
    
    @MainActor
    func purchase() async {
        // In production: Product.purchase() -> verify result
        // For local .storekit testing:
        withAnimation {
            self.isPremium = true
        }
    }

    private func syncWithSupabase(transactionId: String) async {
        // Implementation of Team Member C's verification logic
        var request = URLRequest(url: supabaseSyncUrl)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "transactionId": transactionId,
            "environmentHint": "Sandbox", // Toggle to 'Production' for release
            "userId": "CURRENT_USER_UUID" // Map from Auth session
        ]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        // We fire-and-forget or handle errors quietly to adhere to "Fail-Open"
        let _ = try? await URLSession.shared.data(for: request)
    }
}

// MARK: - Freemium Home View
struct HomeView: View {
    @StateObject private var subManager = SubscriptionManager.shared
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                Spacer()
                Image(systemName: "sparkles")
                    .font(.system(size: 60))
                    .foregroundColor(.blue)
                
                VStack(spacing: 10) {
                    Text("MercyB: English for Vietnam")
                        .font(.title2).bold()
                    Text("Unlock the Teacher persona for pronunciation coaching.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                }

                Button(action: {
                    Task { await subManager.purchase() }
                }) {
                    Text("Upgrade Now")
                        .bold()
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                }
                .padding(.horizontal, 40)
                Spacer()
            }
            .navigationTitle("Welcome")
        }
    }
}

// MARK: - Settings View
struct SettingsView: View {
    @StateObject private var subManager = SubscriptionManager.shared
    
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Subscription")) {
                    HStack {
                        Text("Current Plan")
                        Spacer()
                        Text(subManager.isPremium ? "Premium Pro" : "Free Tier")
                            .foregroundColor(subManager.isPremium ? .blue : .secondary)
                            .bold()
                    }
                }
                
                Section {
                    Button("Restore Purchases") {
                        Task {
                            try? await AppStore.sync()
                            await subManager.updateSubscriptionStatus()
                        }
                    }
                }
            }
            .navigationTitle("Settings")
        }
    }
}

#Preview {
    ContentView()
}