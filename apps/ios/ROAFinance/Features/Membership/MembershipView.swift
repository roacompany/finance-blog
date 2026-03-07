import SwiftUI

struct MembershipView: View {
    @State private var email = ""
    @State private var status: JoinStatus = .idle
    @Environment(\.dismiss) private var dismiss

    enum JoinStatus: Equatable {
        case idle, loading, done
        case failed(String)
    }

    var body: some View {
        ZStack {
            Color.roaBgBase.ignoresSafeArea()
            // sensoryFeedback은 iOS 17+ 네이티브 햅틱 — UIKit import 불필요

            VStack(spacing: 0) {
                // 닫기
                HStack {
                    Spacer()
                    Button { dismiss() } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundStyle(Color.roaTextTertiary)
                            .padding(16)
                    }
                }

                ScrollView {
                    VStack(spacing: 32) {
                        // 브랜드
                        Text("ROA Membership")
                            .font(.roaLabelMd)
                            .tracking(3)
                            .foregroundStyle(Color.roaGold)
                            .padding(.top, 8)

                        // 헤드라인
                        VStack(spacing: 14) {
                            Text("지나간 글은\n멤버만 읽을 수 있어요")
                                .font(.roaHeadingLg)
                                .foregroundStyle(Color.roaTextPrimary)
                                .multilineTextAlignment(.center)
                                .lineSpacing(4)

                            Text("이메일 하나로 무료 가입.\n모든 아카이브 글과 시리즈 전체를 열람하세요.")
                                .font(.roaBodyMd)
                                .foregroundStyle(Color.roaTextSecondary)
                                .multilineTextAlignment(.center)
                                .lineSpacing(4)
                        }

                        // 폼 / 완료
                        if status == .done {
                            doneView
                        } else {
                            formView
                        }

                        // 안심 문구
                        Text("신용카드 불필요 · 언제든 탈퇴 가능")
                            .font(.roaCaption)
                            .foregroundStyle(Color.roaTextTertiary)
                    }
                    .padding(.horizontal, 28)
                    .padding(.bottom, 48)
                }
            }
        }
        .sensoryFeedback(.success, trigger: isDone)
        .sensoryFeedback(.error, trigger: isFailed)
    }

    // MARK: — Form

    private var formView: some View {
        VStack(spacing: 12) {
            TextField("이메일 주소", text: $email)
                .keyboardType(.emailAddress)
                .textInputAutocapitalization(.never)
                .textContentType(.emailAddress)
                .padding(16)
                .background(Color.roaBgElevated)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .strokeBorder(Color.roaBorder, lineWidth: 1)
                )
                .foregroundStyle(Color.roaTextPrimary)

            if case .failed(let msg) = status {
                Text(msg)
                    .font(.roaCaption)
                    .foregroundStyle(Color.roaError)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }

            Button(action: submit) {
                Group {
                    if status == .loading {
                        ProgressView().tint(Color.roaTextInverse)
                    } else {
                        Text("무료로 멤버 가입하기")
                            .font(.roaBodyMd.weight(.semibold))
                    }
                }
                .frame(maxWidth: .infinity, minHeight: 50)
                .background(Color.roaGold)
                .foregroundStyle(Color.roaTextInverse)
                .clipShape(Capsule())
            }
            .disabled(email.isEmpty || status == .loading)
        }
    }

    // MARK: — Done

    private var doneView: some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 52))
                .foregroundStyle(Color.roaGold)

            Text("멤버가 되셨어요")
                .font(.roaHeadingMd)
                .foregroundStyle(Color.roaTextPrimary)

            Text("이제 모든 아카이브 글을\n자유롭게 읽을 수 있어요.")
                .font(.roaBodyMd)
                .foregroundStyle(Color.roaTextSecondary)
                .multilineTextAlignment(.center)

            Button("확인") { dismiss() }
                .font(.roaBodyMd.weight(.semibold))
                .foregroundStyle(Color.roaGold)
        }
    }

    // MARK: — Haptic triggers

    private var isDone: Bool { status == .done }
    private var isFailed: Bool {
        if case .failed = status { return true }
        return false
    }

    // MARK: — Submit

    private func submit() {
        guard email.contains("@") else {
            status = .failed("유효한 이메일을 입력해주세요.")
            return
        }
        status = .loading
        Task {
            do {
                try await APIClient.shared.registerMember(email: email)
                status = .done
            } catch {
                status = .failed(error.localizedDescription)
            }
        }
    }
}
