import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = "https://www.roafinance.me";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "금융답게 바라보기, 로아의 시선 - 개인정보 처리방침",
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy - 금융답게 바라보기, 로아의 시선",
    description: "금융답게 바라보기, 로아의 시선 - 개인정보 처리방침",
    url: `${BASE_URL}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
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
          개인정보 처리방침
        </h1>

        <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#8B95A1', marginBottom: '48px' }}>
          최종 수정일: 2026-01-23
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
            1. 개요
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            ROA Finance(이하 "본 사이트")는 이용자의 개인정보를 중요하게 생각하며,
            「개인정보 보호법」을 준수하고 있습니다.
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            본 개인정보 처리방침은 본 사이트가 어떠한 정보를 수집하고,
            어떻게 사용하며, 보호하는지에 대한 내용을 담고 있습니다.
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
            2. 수집하는 정보
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            본 사이트는 별도의 회원가입 절차가 없으며, 다음의 정보만 자동으로 수집됩니다:
          </p>
          <ul style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: '#4E5968',
            paddingLeft: '24px',
            listStyleType: 'disc',
          }}>
            <li style={{ marginBottom: '12px' }}>방문 일시</li>
            <li style={{ marginBottom: '12px' }}>IP 주소 (익명화)</li>
            <li style={{ marginBottom: '12px' }}>브라우저 정보</li>
            <li style={{ marginBottom: '12px' }}>페이지 조회수</li>
            <li style={{ marginBottom: '12px' }}>유입 경로</li>
          </ul>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginTop: '16px' }}>
            이러한 정보는 Vercel Analytics를 통해 수집되며, 개인을 식별할 수 없는 형태로 처리됩니다.
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
            3. 정보의 이용 목적
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            수집된 정보는 다음의 목적으로만 사용됩니다:
          </p>
          <ul style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: '#4E5968',
            paddingLeft: '24px',
            listStyleType: 'disc',
          }}>
            <li style={{ marginBottom: '12px' }}>사이트 트래픽 분석 및 개선</li>
            <li style={{ marginBottom: '12px' }}>콘텐츠 인기도 측정</li>
            <li style={{ marginBottom: '12px' }}>사용자 경험 향상</li>
            <li style={{ marginBottom: '12px' }}>기술적 문제 해결</li>
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
            4. 쿠키(Cookies)
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            본 사이트는 다음의 쿠키를 사용할 수 있습니다:
          </p>
          <ul style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: '#4E5968',
            paddingLeft: '24px',
            listStyleType: 'disc',
          }}>
            <li style={{ marginBottom: '12px' }}><strong style={{ fontWeight: 700 }}>필수 쿠키</strong>: 사이트 기능 제공을 위한 필수적인 쿠키</li>
            <li style={{ marginBottom: '12px' }}><strong style={{ fontWeight: 700 }}>분석 쿠키</strong>: 사이트 이용 통계를 위한 쿠키 (Vercel Analytics)</li>
          </ul>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginTop: '16px' }}>
            브라우저 설정을 통해 쿠키를 거부할 수 있으나, 일부 기능이 제한될 수 있습니다.
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
            5. 정보의 제3자 제공
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            본 사이트는 이용자의 개인정보를 제3자에게 제공하지 않습니다.
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            단, 다음의 경우 예외로 합니다:
          </p>
          <ul style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: '#4E5968',
            paddingLeft: '24px',
            listStyleType: 'disc',
          }}>
            <li style={{ marginBottom: '12px' }}>법률에 의해 요구되는 경우</li>
            <li style={{ marginBottom: '12px' }}>사이트 운영을 위한 필수 서비스 제공업체 (Vercel, GitHub 등)</li>
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
            6. 정보 보안
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            본 사이트는 SSL/TLS 암호화를 통해 데이터 전송 시 보안을 유지합니다.
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            수집된 통계 데이터는 안전하게 보관되며,
            정기적으로 불필요한 데이터를 삭제합니다.
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
            7. 이용자의 권리
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
          </p>
          <ul style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: '#4E5968',
            paddingLeft: '24px',
            listStyleType: 'disc',
          }}>
            <li style={{ marginBottom: '12px' }}>개인정보 수집·이용 거부 (쿠키 차단)</li>
            <li style={{ marginBottom: '12px' }}>수집된 정보에 대한 열람 요구</li>
            <li style={{ marginBottom: '12px' }}>잘못된 정보의 정정 요구</li>
            <li style={{ marginBottom: '12px' }}>정보 삭제 요구</li>
          </ul>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginTop: '16px' }}>
            권리 행사는 <a href="mailto:contact@roafinance.me" style={{ color: '#3182F6', textDecoration: 'none' }}>contact@roafinance.me</a>로 요청하실 수 있습니다.
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
            8. 개인정보 처리방침 변경
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            본 개인정보 처리방침은 관련 법령 또는 사이트 정책 변경에 따라 수정될 수 있습니다.
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            변경 시 사이트에 공지하며, 중요한 변경사항은 이메일을 통해 개별 통지할 수 있습니다.
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
            9. 문의
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4E5968', marginBottom: '16px' }}>
            개인정보 처리방침에 관한 문의사항은 아래로 연락주세요:
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
