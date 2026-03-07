import SwiftUI
import UIKit

struct FeedView: View {
    @State private var viewModel = FeedViewModel()
    @State private var selectedArticle: Article?
    @State private var showMembership = false

    var body: some View {
        NavigationStack {
            ZStack {
                Color.roaBgBase.ignoresSafeArea()

                switch viewModel.state {
                case .idle, .loading:
                    skeletonView
                case .loaded(let articles):
                    articleList(articles)
                case .failed(let error):
                    errorView(error)
                }
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
                    Button {
                        showMembership = true
                    } label: {
                        Image(systemName: "person.circle")
                            .foregroundStyle(Color.roaTextTertiary)
                    }
                }
            }
            .navigationDestination(item: $selectedArticle) { article in
                ArticleView(article: article, showMembership: $showMembership)
            }
        }
        .tint(Color.roaGold)
        .task { await viewModel.load() }
        .sheet(isPresented: $showMembership) {
            MembershipView()
        }
    }

    // MARK: — Article List

    private func articleList(_ articles: [Article]) -> some View {
        let filtered = viewModel.filteredArticles
        return ScrollView {
            LazyVStack(spacing: 0) {
                // 오늘의 노트 배너
                if let today = articles.first(where: { $0.isToday }), viewModel.selectedSeries == nil {
                    TodayBanner(article: today) {
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        selectedArticle = today
                    }
                }

                // 시리즈 필터 바
                if !viewModel.allSeries.isEmpty {
                    seriesFilterBar
                        .padding(.top, 12)
                }

                // 아카이브 헤더
                archiveSectionHeader
                    .padding(.horizontal, 20)
                    .padding(.vertical, 16)

                // 아카이브 목록
                let archive = filtered.filter { !$0.isToday }
                ForEach(Array(archive.enumerated()), id: \.element.id) { index, article in
                    ArticleRow(article: article, index: index) {
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        selectedArticle = article
                    }
                    if index < archive.count - 1 {
                        Divider()
                            .background(Color.roaBorderSubtle)
                            .padding(.horizontal, 20)
                    }
                }

                // 멤버십 배너
                if viewModel.selectedSeries == nil {
                    MembershipBannerRow {
                        showMembership = true
                    }
                    .padding(.top, 8)
                }
            }
        }
        .scrollIndicators(.hidden)
        .refreshable { await viewModel.load() }
    }

    // MARK: — Series Filter Bar

    private var seriesFilterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                // 전체 칩
                SeriesChip(
                    label: "전체",
                    isSelected: viewModel.selectedSeries == nil
                ) {
                    UIImpactFeedbackGenerator(style: .soft).impactOccurred()
                    viewModel.selectSeries(nil)
                }

                ForEach(viewModel.allSeries, id: \.self) { series in
                    let label = series.replacingOccurrences(
                        of: #"^Series \d+\.\s*"#,
                        with: "",
                        options: .regularExpression
                    )
                    SeriesChip(
                        label: label,
                        isSelected: viewModel.selectedSeries == series
                    ) {
                        UIImpactFeedbackGenerator(style: .soft).impactOccurred()
                        viewModel.selectSeries(series)
                    }
                }
            }
            .padding(.horizontal, 20)
        }
    }

    // MARK: — Section Header

    private var archiveSectionHeader: some View {
        HStack {
            Text("아카이브")
                .font(.roaLabelSm)
                .tracking(2)
                .foregroundStyle(Color.roaTextTertiary)

            Rectangle()
                .frame(height: 1)
                .foregroundStyle(Color.roaBorder)

            HStack(spacing: 4) {
                Image(systemName: "lock.fill")
                    .font(.system(size: 9))
                Text("멤버만 전체 열람")
                    .font(.roaLabelSm)
            }
            .foregroundStyle(Color.roaTextTertiary)
        }
    }

    // MARK: — Loading Skeleton

    private var skeletonView: some View {
        ScrollView {
            VStack(spacing: 0) {
                // 오늘 배너 스켈레톤
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color.roaBgElevated)
                    .frame(height: 280)
                    .overlay(alignment: .bottomLeading) {
                        VStack(alignment: .leading, spacing: 10) {
                            skeletonBlock(width: 80, height: 24)
                            skeletonBlock(width: 240, height: 20)
                            skeletonBlock(width: 180, height: 14)
                        }
                        .padding(20)
                    }

                VStack(spacing: 0) {
                    ForEach(0..<6, id: \.self) { _ in
                        ArticleRowSkeleton()
                        Divider().background(Color.roaBorderSubtle).padding(.horizontal, 20)
                    }
                }
                .padding(.top, 52)
            }
        }
        .scrollDisabled(true)
    }

    private func skeletonBlock(width: CGFloat, height: CGFloat) -> some View {
        RoundedRectangle(cornerRadius: 4)
            .fill(Color.roaBgSubtle)
            .frame(width: width, height: height)
    }

    // MARK: — Error

    private func errorView(_ message: String) -> some View {
        VStack(spacing: 20) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 44))
                .foregroundStyle(Color.roaTextTertiary)
            Text(message)
                .font(.roaBodyMd)
                .foregroundStyle(Color.roaTextSecondary)
                .multilineTextAlignment(.center)
            Button("다시 시도") {
                Task { await viewModel.load() }
            }
            .foregroundStyle(Color.roaGold)
        }
        .padding(40)
    }
}

// MARK: — Today Banner

struct TodayBanner: View {
    let article: Article
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            ZStack(alignment: .bottomLeading) {
                // 배경 그라디언트
                LinearGradient(
                    colors: article.gradientColors,
                    startPoint: .topTrailing,
                    endPoint: .bottomLeading
                )
                .frame(height: 300)

                // 어둠 오버레이
                LinearGradient(
                    colors: [.clear, Color.roaBgBase.opacity(0.92)],
                    startPoint: .top,
                    endPoint: .bottom
                )

                // 콘텐츠
                VStack(alignment: .leading, spacing: 10) {
                    todayBadge

                    Text(article.title)
                        .font(.roaHeadingLg)
                        .foregroundStyle(Color.roaTextPrimary)
                        .lineLimit(3)
                        .lineSpacing(3)

                    Text(article.description)
                        .font(.roaBodySm)
                        .foregroundStyle(Color.roaTextSecondary)
                        .lineLimit(2)

                    HStack(spacing: 4) {
                        Image(systemName: "clock")
                            .font(.system(size: 10))
                        Text("\(article.readingTime) · \(article.formattedDate)")
                            .font(.roaCaption)
                    }
                    .foregroundStyle(Color.roaTextTertiary)
                }
                .padding(20)
            }
        }
        .buttonStyle(.plain)
    }

    private var todayBadge: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(Color.roaGold)
                .frame(width: 6, height: 6)
            Text("오늘의 노트")
                .font(.roaLabelSm)
                .tracking(2)
        }
        .foregroundStyle(Color.roaGold)
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(Color.roaBgBase.opacity(0.5))
        .clipShape(Capsule())
        .overlay(Capsule().strokeBorder(Color.roaGold.opacity(0.35), lineWidth: 1))
    }
}

// MARK: — Article Row

struct ArticleRow: View {
    let article: Article
    let index: Int
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(alignment: .top, spacing: 14) {
                // 썸네일
                ZStack(alignment: .topTrailing) {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(LinearGradient(
                            colors: article.gradientColors,
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ))
                        .frame(width: 72, height: 54)

                    if !article.isToday {
                        Image(systemName: "lock.fill")
                            .font(.system(size: 8))
                            .foregroundStyle(Color.roaTextTertiary)
                            .padding(5)
                    }
                }

                VStack(alignment: .leading, spacing: 5) {
                    if !article.series.isEmpty {
                        Text(article.series)
                            .font(.roaCaption)
                            .foregroundStyle(Color.roaTextTertiary)
                            .lineLimit(1)
                    }

                    Text(article.title)
                        .font(.roaBodyMd.weight(.semibold))
                        .foregroundStyle(Color.roaTextPrimary)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)

                    HStack(spacing: 4) {
                        Text(article.readingTime)
                            .font(.roaCaption)
                            .foregroundStyle(Color.roaTextTertiary)

                        if let tag = article.tags.first {
                            Text("·")
                                .foregroundStyle(Color.roaTextTertiary.opacity(0.4))
                            Text(tag)
                                .font(.roaCaption)
                                .foregroundStyle(Color.roaTextTertiary)
                        }
                    }
                }

                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
        }
        .buttonStyle(.plain)
    }
}

// MARK: — Membership Banner Row

struct MembershipBannerRow: View {
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 12) {
                Text("ROA Membership")
                    .font(.roaLabelSm)
                    .tracking(3)
                    .foregroundStyle(Color.roaGold)

                Text("모든 아카이브를 자유롭게 읽으세요")
                    .font(.roaHeadingMd)
                    .foregroundStyle(Color.roaTextPrimary)
                    .multilineTextAlignment(.center)

                Text("이메일 하나로 무료 가입")
                    .font(.roaBodySm)
                    .foregroundStyle(Color.roaTextSecondary)

                Text("무료로 멤버 가입하기")
                    .font(.roaBodyMd.weight(.semibold))
                    .foregroundStyle(Color.roaTextInverse)
                    .frame(maxWidth: 240, minHeight: 44)
                    .background(Color.roaGold)
                    .clipShape(Capsule())
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 40)
            .frame(maxWidth: .infinity)
            .background(Color.roaBgElevated)
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundStyle(Color.roaBorderSubtle),
                alignment: .top
            )
        }
        .buttonStyle(.plain)
    }
}

// MARK: — Row Skeleton

struct ArticleRowSkeleton: View {
    @State private var animating = false

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.roaBgElevated)
                .frame(width: 72, height: 54)

            VStack(alignment: .leading, spacing: 8) {
                RoundedRectangle(cornerRadius: 4)
                    .fill(Color.roaBgElevated)
                    .frame(width: 200, height: 12)
                RoundedRectangle(cornerRadius: 4)
                    .fill(Color.roaBgElevated)
                    .frame(width: 140, height: 12)
            }
            Spacer()
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .opacity(animating ? 0.4 : 0.9)
        .onAppear {
            withAnimation(.easeInOut(duration: 0.85).repeatForever()) {
                animating = true
            }
        }
    }
}

// MARK: — Series Chip

struct SeriesChip: View {
    let label: String
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            Text(label)
                .font(.roaLabelSm)
                .foregroundStyle(isSelected ? Color.roaTextInverse : Color.roaTextSecondary)
                .padding(.horizontal, 14)
                .padding(.vertical, 7)
                .background(isSelected ? Color.roaGold : Color.roaBgElevated)
                .clipShape(Capsule())
                .overlay(
                    Capsule().strokeBorder(
                        isSelected ? Color.clear : Color.roaBorder,
                        lineWidth: 1
                    )
                )
        }
        .buttonStyle(.plain)
        .animation(.spring(response: 0.25, dampingFraction: 0.7), value: isSelected)
    }
}
