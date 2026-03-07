import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = "https://www.roafinance.me";

export const metadata: Metadata = {
  title: "Contact",
  description: "금융답게 바라보기, 로아의 시선 - 문의하기",
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
  openGraph: {
    title: "Contact - 금융답게 바라보기, 로아의 시선",
    description: "금융답게 바라보기, 로아의 시선 - 문의하기",
    url: `${BASE_URL}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #F2F4F6', padding: '16px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Link
            href="/"
            style={{ fontSize: '14px', color: '#8B95A1', textDecoration: 'none' }}
          >
            ← 홈으로
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <article style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
          color: '#191F28',
          marginBottom: '16px',
        }}>
          Contact
        </h1>

        <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#4E5968', marginBottom: '48px' }}>
          문의사항, 피드백, 제휴 제안 등 언제든지 연락주세요.
        </p>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1.4,
            color: '#191F28',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #E5E8EB',
          }}>
            이메일
          </h2>
          <div style={{
            padding: '24px',
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            border: '1px solid #E5E8EB',
          }}>
            <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '12px' }}>
              📧 <a href="mailto:contact@roafinance.me" style={{ color: '#3182F6', textDecoration: 'none', fontWeight: 600 }}>contact@roafinance.me</a>
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#8B95A1' }}>
              영업일 기준 2-3일 내 회신드립니다.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1.4,
            color: '#191F28',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #E5E8EB',
          }}>
            문의 유형
          </h2>
          <ul style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: '#4E5968',
            paddingLeft: '24px',
            listStyleType: 'disc',
          }}>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ fontWeight: 700 }}>콘텐츠 피드백</strong>
              <p style={{ fontSize: '15px', color: '#8B95A1', margin: '4px 0 0 0' }}>
                오류 제보, 개선 제안, 추가 요청 주제 등
              </p>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ fontWeight: 700 }}>기술 문제</strong>
              <p style={{ fontSize: '15px', color: '#8B95A1', margin: '4px 0 0 0' }}>
                사이트 접속 오류, 렌더링 문제, 모바일 이슈 등
              </p>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ fontWeight: 700 }}>제휴 제안</strong>
              <p style={{ fontSize: '15px', color: '#8B95A1', margin: '4px 0 0 0' }}>
                게스트 포스트, 기고, 협업 등
              </p>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ fontWeight: 700 }}>기타 문의</strong>
              <p style={{ fontSize: '15px', color: '#8B95A1', margin: '4px 0 0 0' }}>
                저작권, 인용, 개인정보 등
              </p>
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1.4,
            color: '#191F28',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #E5E8EB',
          }}>
            회신 시간
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            평일 (월~금): 영업일 기준 2-3일 내 회신
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            주말 및 공휴일: 다음 영업일에 순차적으로 확인 및 회신
          </p>
          <div style={{
            padding: '16px',
            backgroundColor: '#FFF9E6',
            borderRadius: '8px',
            border: '1px solid #FFE59C',
            marginTop: '16px',
          }}>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#6B5000', margin: 0 }}>
              💡 긴급한 기술 문제의 경우, 이메일 제목에 <strong>[긴급]</strong>을 표시해주시면 우선 처리됩니다.
            </p>
          </div>
        </section>

        <section>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1.4,
            color: '#191F28',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #E5E8EB',
          }}>
            FAQ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '8px' }}>
                Q. 개인 투자 상담도 가능한가요?
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#6B7684' }}>
                A. 죄송하지만, 본 블로그는 정보 제공 목적으로 운영되며 개인 투자 상담은 제공하지 않습니다.
                금융 전문가와 상담하시는 것을 권장드립니다.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '8px' }}>
                Q. 콘텐츠를 인용하거나 공유해도 되나요?
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#6B7684' }}>
                A. 네, 출처를 명시하시면 자유롭게 인용 및 공유 가능합니다.
                단, 상업적 목적의 무단 전재는 금지됩니다.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#191F28', marginBottom: '8px' }}>
                Q. 광고나 협찬은 받나요?
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#6B7684' }}>
                A. 현재 광고 및 협찬은 받지 않고 있습니다.
                향후 정책 변경 시 별도 공지드리겠습니다.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #F2F4F6',
        padding: '32px 24px',
        backgroundColor: '#F9FAFB',
        marginTop: '64px',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <Link
            href="/"
            style={{ fontSize: '14px', color: '#8B95A1', textDecoration: 'none' }}
          >
            ← 홈으로
          </Link>
        </div>
      </footer>
    </div>
  );
}
