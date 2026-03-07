import SwiftUI

/// ROA Finance 타이포그래피 토큰
extension Font {
    // ─── Serif (제목) ──────────────────────────────────────
    static let roaDisplayLg = Font.custom("Georgia", size: 40).weight(.bold)
    static let roaDisplayMd = Font.custom("Georgia", size: 32).weight(.bold)
    static let roaHeadingXl = Font.custom("Georgia", size: 28).weight(.bold)
    static let roaHeadingLg = Font.custom("Georgia", size: 24).weight(.bold)
    static let roaHeadingMd = Font.custom("Georgia", size: 20).weight(.bold)

    // ─── Sans (본문) ───────────────────────────────────────
    static let roaBodyLg = Font.system(size: 17, weight: .regular)
    static let roaBodyMd = Font.system(size: 15, weight: .regular)
    static let roaBodySm = Font.system(size: 13, weight: .regular)

    // ─── Label / Caption ──────────────────────────────────
    static let roaLabelMd = Font.system(size: 12, weight: .semibold)
    static let roaLabelSm = Font.system(size: 10, weight: .semibold)
    static let roaCaption  = Font.system(size: 11, weight: .regular)
}
