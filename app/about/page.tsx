import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = "https://www.roafinance.me";

export const metadata: Metadata = {
  title: "About",
  description: "금융답게 바라보기, 로아의 시선 - 저자 소개 및 블로그 운영 방침",
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: "About - 금융답게 바라보기, 로아의 시선",
    description: "금융답게 바라보기, 로아의 시선 - 저자 소개 및 블로그 운영 방침",
    url: `${BASE_URL}/about`,
    type: "website",
  },
};

export default function AboutPage() {
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
          About 로아(ROA)
        </h1>

        <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#4E5968', marginBottom: '48px' }}>
          금융을 금융답게 바라보는 사람
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
            누구인가요?
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            안녕하세요. 금융 블로거 로아입니다.
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            개인 투자자로서 여러 시행착오를 겪으며 금융 지식의 중요성을 깨달았습니다.
            복잡한 금융 개념을 누구나 이해할 수 있는 언어로 풀어내는 것이 목표입니다.
          </p>
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
            전문성
          </h2>
          <ul style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: '#4E5968',
            paddingLeft: '24px',
            listStyleType: 'disc',
          }}>
            <li style={{ marginBottom: '12px' }}>금융 시장 분석 및 투자 경험</li>
            <li style={{ marginBottom: '12px' }}>실전 대출 및 자산 관리 경험</li>
            <li style={{ marginBottom: '12px' }}>금융 제도 및 정책 연구</li>
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
            블로그 목적
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            이 블로그는 <strong style={{ fontWeight: 700, color: '#191F28' }}>금융 지식의 격차를 줄이고</strong>,
            누구나 쉽게 이해할 수 있는 금융 정보를 제공하기 위해 시작했습니다.
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            모든 글은 공식 출처를 기반으로 작성하며, 출처를 명확히 표기합니다.
            정확성과 신뢰성을 최우선으로 합니다.
          </p>
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
            운영 원칙
          </h2>
          <div style={{
            padding: '24px',
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            border: '1px solid #E5E8EB',
            marginBottom: '16px',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#191F28', marginBottom: '12px' }}>
              ROA Writing Principles
            </h3>
            <ul style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#4E5968',
              paddingLeft: '24px',
              listStyleType: 'disc',
            }}>
              <li style={{ marginBottom: '8px' }}><strong style={{ fontWeight: 700 }}>정확성 (Accurate)</strong>: 공식 출처 기반, 팩트 체크</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ fontWeight: 700 }}>간결성 (Concise)</strong>: 문장당 최대 2줄</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ fontWeight: 700 }}>친근성 (Friendly)</strong>: 해요체, 쉬운 용어</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ fontWeight: 700 }}>실용성 (Practical)</strong>: 실생활에 적용 가능한 정보</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ fontWeight: 700 }}>사실성 (Factual)</strong>: 과장 없는 객관적 서술</li>
            </ul>
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
            Disclaimer
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#6B7684', marginBottom: '12px' }}>
            본 블로그의 모든 콘텐츠는 <strong>정보 제공 목적</strong>으로 작성되었으며,
            투자 권유나 금융 조언이 아닙니다.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#6B7684', marginBottom: '12px' }}>
            실제 투자 결정은 전문가와 상담 후 본인의 판단 하에 이루어져야 합니다.
            작성일 기준 정보이며, 관련 법규나 제도는 변경될 수 있습니다.
          </p>
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
            Contact
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '12px' }}>
            문의사항이나 피드백은 아래로 연락주세요:
          </p>
          <ul style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: '#4E5968',
            listStyleType: 'none',
            paddingLeft: 0,
          }}>
            <li style={{ marginBottom: '8px' }}>
              📧 이메일: <a href="mailto:contact@roafinance.me" style={{ color: '#3182F6', textDecoration: 'none' }}>contact@roafinance.me</a>
            </li>
          </ul>
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
