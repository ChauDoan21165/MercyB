// Path: ios/App/App/AppleSubscriptionService.swift

import Foundation
import StoreKit

struct AppleIapSyncRequest: Encodable {
    let signedTransactionInfo: String
    let appAccountToken: UUID
    let platform: String = "ios"
    let environmentHint: String?
}

struct AppleIapSyncResponse: Decodable {
    let ok: Bool
    let entitlementRefreshRequired: Bool?
    let error: String?

    enum CodingKeys: String, CodingKey {
        case ok
        case entitlementRefreshRequired = "entitlement_refresh_required"
        case error
    }
}

struct MeEntitlementResponse: Decodable {
    let premium: Bool
}

enum AppleSubscriptionError: Error {
    case pending
    case cancelled
    case unverifiedTransaction
    case missingJWSTransaction
    case backendRejected(String)
    case invalidBackendResponse
}

@MainActor
final class AppleSubscriptionService {
    private let session: URLSession
    private let baseURL: URL
    private let authTokenProvider: @Sendable () async throws -> String

    init(
        baseURL: URL,
        session: URLSession = .shared,
        authTokenProvider: @escaping @Sendable () async throws -> String
    ) {
        self.baseURL = baseURL
        self.session = session
        self.authTokenProvider = authTokenProvider
    }

    func purchase(productId: String, appAccountToken: UUID) async throws -> Bool {
        let products = try await Product.products(for: [productId])
        guard let product = products.first else {
            throw AppleSubscriptionError.invalidBackendResponse
        }

        let result = try await product.purchase(options: [.appAccountToken(appAccountToken)])

        switch result {
        case .pending:
            throw AppleSubscriptionError.pending

        case .userCancelled:
            throw AppleSubscriptionError.cancelled

        case .success(let verification):
            let signedTransactionInfo = verification.jwsRepresentation
            guard !signedTransactionInfo.isEmpty else {
                throw AppleSubscriptionError.missingJWSTransaction
            }

            let transaction = try requireVerified(verification)

            try await syncPurchaseToBackend(
                signedTransactionInfo: signedTransactionInfo,
                appAccountToken: appAccountToken,
                environmentHint: nil
            )

            await transaction.finish()
            return try await refreshEntitlementFromBackend()

        @unknown default:
            throw AppleSubscriptionError.invalidBackendResponse
        }
    }

    func restoreAndRefreshEntitlement() async throws -> Bool {
        try await AppStore.sync()
        return try await refreshEntitlementFromBackend()
    }

    func refreshEntitlementFromBackend() async throws -> Bool {
        let token = try await authTokenProvider()
        var request = URLRequest(url: baseURL.appendingPathComponent("me-entitlement"))
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse, 200..<300 ~= http.statusCode else {
            throw AppleSubscriptionError.invalidBackendResponse
        }

        let decoded = try JSONDecoder().decode(MeEntitlementResponse.self, from: data)
        return decoded.premium
    }

    private func syncPurchaseToBackend(
        signedTransactionInfo: String,
        appAccountToken: UUID,
        environmentHint: String?
    ) async throws {
        let token = try await authTokenProvider()
        var request = URLRequest(url: baseURL.appendingPathComponent("apple-iap-sync"))
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(
            AppleIapSyncRequest(
                signedTransactionInfo: signedTransactionInfo,
                appAccountToken: appAccountToken,
                environmentHint: environmentHint
            )
        )

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw AppleSubscriptionError.invalidBackendResponse
        }

        let decoded = try JSONDecoder().decode(AppleIapSyncResponse.self, from: data)
        guard 200..<300 ~= http.statusCode, decoded.ok else {
            throw AppleSubscriptionError.backendRejected(decoded.error ?? "apple_sync_failed")
        }
    }

    private func requireVerified<T>(_ verification: VerificationResult<T>) throws -> T {
        switch verification {
        case .verified(let value):
            return value
        case .unverified:
            throw AppleSubscriptionError.unverifiedTransaction
        }
    }
}