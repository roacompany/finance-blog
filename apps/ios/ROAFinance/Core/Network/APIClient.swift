import Foundation

actor APIClient {
    static let shared = APIClient()

    private let baseURL: URL = {
        #if DEBUG
        URL(string: "http://localhost:3000")!
        #else
        URL(string: "https://www.roafinance.me")!
        #endif
    }()

    private let session: URLSession = {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 15
        config.timeoutIntervalForResource = 60
        return URLSession(configuration: config)
    }()

    // MARK: — Posts

    func fetchPosts() async throws -> [Article] {
        let url = baseURL.appendingPathComponent("/api/posts")
        let (data, response) = try await session.data(from: url)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw APIError.invalidResponse
        }
        return try JSONDecoder().decode(PostsResponse.self, from: data).posts
    }

    // MARK: — Membership

    func registerMember(email: String) async throws {
        let url = baseURL.appendingPathComponent("/api/membership")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["email": email])
        let (_, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw APIError.invalidResponse
        }
    }
}

// MARK: — Error

enum APIError: Error, LocalizedError, Sendable {
    case invalidResponse
    case decodingFailed

    var errorDescription: String? {
        switch self {
        case .invalidResponse: "서버 응답이 올바르지 않아요."
        case .decodingFailed:  "데이터를 읽을 수 없어요."
        }
    }
}
