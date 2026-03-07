import SwiftUI
import WebKit

struct ArticleView: View {
    let article: Article
    @Binding var showMembership: Bool
    @State private var webViewHeight: CGFloat = UIScreen.main.bounds.height * 0.6
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            Color.roaBgBase.ignoresSafeArea()

            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    articleHeader
                        .padding(.bottom, 8)

                    Divider()
                        .background(Color.roaBorderSubtle)

                    // 본문 — WKWebView (네이티브 리딩 경험: 웹 스타일 그대로)
                    if let url = article.webURL {
                        ArticleWebView(url: url)
                            .frame(height: webViewHeight)
                    }

                    // 비멤버 전용 하단 CTA
                    if !article.isToday {
                        membershipCTA
                    }
                }
            }
            .scrollIndicators(.hidden)
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                Text("ROA Finance")
                    .font(.roaLabelMd)
                    .tracking(3)
                    .foregroundStyle(Color.roaGold)
            }
            ToolbarItem(placement: .topBarTrailing) {
                if let url = article.webURL {
                    ShareLink(item: url) {
                        Image(systemName: "square.and.arrow.up")
                            .foregroundStyle(Color.roaTextTertiary)
                    }
                }
            }
        }
        .tint(Color.roaGold)
    }

    // MARK: — Article Header

    private var articleHeader: some View {
        VStack(alignment: .leading, spacing: 16) {
            // 뱃지 행
            HStack(spacing: 8) {
                if article.isToday { todayBadge } else { archiveBadge }
                if !article.series.isEmpty {
                    Text(article.series)
                        .font(.roaBodySm)
                        .foregroundStyle(Color.roaTextSecondary)
                        .lineLimit(1)
                }
            }

            // 제목
            Text(article.title)
                .font(.roaHeadingXl)
                .foregroundStyle(Color.roaTextPrimary)
                .lineSpacing(4)

            // 부제
            Text(article.description)
                .font(.roaBodyMd)
                .foregroundStyle(Color.roaTextSecondary)
                .lineSpacing(3)

            // 메타
            HStack(spacing: 6) {
                Text(article.formattedDate)
                Text("·").foregroundStyle(Color.roaTextTertiary.opacity(0.4))
                Text(article.readingTime)
                ForEach(article.tags.prefix(2), id: \.self) { tag in
                    Text("·").foregroundStyle(Color.roaTextTertiary.opacity(0.4))
                    Text(tag)
                }
            }
            .font(.roaCaption)
            .foregroundStyle(Color.roaTextTertiary)
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
        .padding(.bottom, 20)
    }

    // MARK: — Badges

    private var todayBadge: some View {
        HStack(spacing: 6) {
            Circle().fill(Color.roaGold).frame(width: 6, height: 6)
            Text("오늘의 노트").font(.roaLabelSm).tracking(2)
        }
        .foregroundStyle(Color.roaGold)
        .padding(.horizontal, 10).padding(.vertical, 5)
        .background(Color.roaGoldMuted)
        .clipShape(Capsule())
        .overlay(Capsule().strokeBorder(Color.roaGold.opacity(0.2), lineWidth: 1))
    }

    private var archiveBadge: some View {
        HStack(spacing: 6) {
            Image(systemName: "lock.fill").font(.system(size: 8))
            Text("아카이브").font(.roaLabelSm).tracking(2)
        }
        .foregroundStyle(Color.roaTextTertiary)
        .padding(.horizontal, 10).padding(.vertical, 5)
        .background(Color.roaBgElevated)
        .clipShape(Capsule())
        .overlay(Capsule().strokeBorder(Color.roaBorder, lineWidth: 1))
    }

    // MARK: — Membership CTA

    private var membershipCTA: some View {
        VStack(spacing: 16) {
            Text("지나간 글은 멤버에게만 공개돼요")
                .font(.roaHeadingMd)
                .foregroundStyle(Color.roaTextPrimary)
                .multilineTextAlignment(.center)

            Text("이메일 하나로 모든 아카이브를 열람하세요")
                .font(.roaBodySm)
                .foregroundStyle(Color.roaTextSecondary)
                .multilineTextAlignment(.center)

            Button {
                showMembership = true
            } label: {
                Text("무료로 멤버 가입하기")
                    .font(.roaBodyMd.weight(.semibold))
                    .foregroundStyle(Color.roaTextInverse)
                    .frame(maxWidth: .infinity, minHeight: 50)
                    .background(Color.roaGold)
                    .clipShape(Capsule())
            }
            .padding(.horizontal, 20)

            Text("신용카드 불필요 · 언제든 탈퇴 가능")
                .font(.roaCaption)
                .foregroundStyle(Color.roaTextTertiary)
        }
        .padding(28)
        .background(Color.roaBgElevated)
        .overlay(
            Rectangle().frame(height: 1).foregroundStyle(Color.roaBorderSubtle),
            alignment: .top
        )
    }
}

// MARK: — WKWebView Representable

@MainActor
struct ArticleWebView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> WKWebView {
        let preferences = WKWebpagePreferences()
        preferences.allowsContentJavaScript = true
        let config = WKWebViewConfiguration()
        config.defaultWebpagePreferences = preferences

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.backgroundColor = UIColor(Color.roaBgBase)
        webView.isOpaque = false
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.backgroundColor = UIColor(Color.roaBgBase)
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        webView.load(URLRequest(url: url))
    }
}
