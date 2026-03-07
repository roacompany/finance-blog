import SwiftUI

/// ROA Finance 디자인 토큰 — packages/design-tokens/src/colors.ts와 1:1 대응
extension Color {
    // ─── Background ───────────────────────────────────────
    static let roaBgBase     = Color(hex: "#0A0A0A")
    static let roaBgElevated = Color(hex: "#111111")
    static let roaBgOverlay  = Color(hex: "#1A1A1A")
    static let roaBgSubtle   = Color(hex: "#222222")

    // ─── Text ─────────────────────────────────────────────
    static let roaTextPrimary   = Color(hex: "#F5F5F5")
    static let roaTextSecondary = Color(hex: "#A0A0A0")
    static let roaTextTertiary  = Color(hex: "#666666")

    // ─── Border ───────────────────────────────────────────
    static let roaBorder       = Color(hex: "#2A2A2A")
    static let roaBorderSubtle = Color(hex: "#1E1E1E")

    // ─── Brand ────────────────────────────────────────────
    static let roaGold        = Color(hex: "#E8D5B0")
    static let roaGoldMuted   = Color(hex: "#3A3020")
    static let roaTextInverse = Color(hex: "#0A0A0A") // 밝은 배경 위 텍스트 (CTA 버튼)

    // ─── Semantic ─────────────────────────────────────────
    static let roaSuccess = Color(hex: "#4CAF50")
    static let roaError   = Color(hex: "#F44336")

    // ─── Article Gradient Pairs (tag-based) ───────────────
    static let roaGradientRateStart   = Color(hex: "#0f2318")
    static let roaGradientRateEnd     = Color(hex: "#1a3d2b")
    static let roaGradientLoanStart   = Color(hex: "#2e0f0f")
    static let roaGradientLoanEnd     = Color(hex: "#4a1a1a")
    static let roaGradientInvestStart = Color(hex: "#12122e")
    static let roaGradientInvestEnd   = Color(hex: "#1e1e4a")
    static let roaGradientTaxStart    = Color(hex: "#28200f")
    static let roaGradientTaxEnd      = Color(hex: "#42321a")
    static let roaGradientDefaultStart = Color(hex: "#111827")
    static let roaGradientDefaultEnd   = Color(hex: "#1e2a3a")
}

extension Color {
    /// Hex string 초기화 (#RRGGBB 또는 #AARRGGBB)
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:  (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:  (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:  (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default: (a, r, g, b) = (255, 245, 245, 245)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
