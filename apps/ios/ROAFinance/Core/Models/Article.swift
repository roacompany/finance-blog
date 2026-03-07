import Foundation
import SwiftUI

struct Article: Identifiable, Decodable, Sendable, Hashable {
    let id: String
    let slug: String
    let title: String
    let description: String
    let date: String
    let tags: [String]
    let series: String
    let readingTime: String
    let isToday: Bool

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "ko_KR")
        formatter.timeZone = TimeZone(identifier: "Asia/Seoul")
        formatter.dateFormat = "yyyy-MM-dd"
        guard let parsed = formatter.date(from: date) else { return date }
        formatter.dateFormat = "M월 d일"
        return formatter.string(from: parsed)
    }

    var webURL: URL? {
        #if DEBUG
        URL(string: "http://localhost:3000/posts/\(slug)")
        #else
        URL(string: "https://www.roafinance.me/posts/\(slug)")
        #endif
    }

    var gradientColors: [Color] {
        let tag = tags.first ?? ""
        if tag.contains("금리") { return [.roaGradientRateStart,   .roaGradientRateEnd] }
        if tag.contains("대출") { return [.roaGradientLoanStart,   .roaGradientLoanEnd] }
        if tag.contains("투자") { return [.roaGradientInvestStart, .roaGradientInvestEnd] }
        if tag.contains("세금") { return [.roaGradientTaxStart,    .roaGradientTaxEnd] }
        return [.roaGradientDefaultStart, .roaGradientDefaultEnd]
    }
}

struct PostsResponse: Decodable, Sendable {
    let posts: [Article]
}
