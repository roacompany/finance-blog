import Foundation
import SwiftUI
import Observation

@Observable
@MainActor
final class FeedViewModel {
    enum State: Sendable {
        case idle
        case loading
        case loaded([Article])
        case failed(String)
    }

    var state: State = .idle
    var selectedSeries: String? = nil

    // 현재 선택된 시리즈로 필터링된 아티클
    var filteredArticles: [Article] {
        guard case .loaded(let articles) = state else { return [] }
        guard let series = selectedSeries else { return articles }
        return articles.filter { $0.series == series }
    }

    // 포스트에서 동적 추출 (순서 유지, 중복 제거)
    var allSeries: [String] {
        guard case .loaded(let articles) = state else { return [] }
        var seen = Set<String>()
        return articles.compactMap { article in
            guard !article.series.isEmpty, seen.insert(article.series).inserted else { return nil }
            return article.series
        }.sorted()
    }

    func load() async {
        state = .loading
        do {
            let posts = try await APIClient.shared.fetchPosts()
            state = .loaded(posts)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    func selectSeries(_ series: String?) {
        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            selectedSeries = selectedSeries == series ? nil : series
        }
    }
}
