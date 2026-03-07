import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'ROA Finance';
  const desc  = searchParams.get('desc')  || '금융을 깊이 이해하는 사람들을 위한 인사이트 미디어';
  const tags  = searchParams.get('tags')  || '';

  const tagList = tags.split(',').filter(Boolean).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0A0A',
          padding: '64px 80px',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* 상단 골드 라인 */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#E8D5B0' }} />

        {/* 배경 그라디언트 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(232,213,176,0.05) 0%, transparent 70%)',
        }} />

        {/* 상단: 브랜드 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '15px', letterSpacing: '0.18em', color: '#E8D5B0', fontWeight: 600, textTransform: 'uppercase' }}>
            ROA Finance
          </span>
          <span style={{ width: '1px', height: '14px', backgroundColor: 'rgba(232,213,176,0.25)' }} />
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
            roafinance.me
          </span>
        </div>

        {/* 중단: 제목 + 설명 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '860px' }}>
          <h1
            style={{
              fontSize: title.length > 28 ? '48px' : '58px',
              fontWeight: 700,
              color: '#F5F5F5',
              lineHeight: 1.25,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          {desc && (
            <p
              style={{
                fontSize: '22px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.6,
                margin: 0,
                fontFamily: 'sans-serif',
              }}
            >
              {desc.length > 72 ? desc.slice(0, 72) + '...' : desc}
            </p>
          )}
        </div>

        {/* 하단: 태그 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {tagList.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: '13px',
                color: '#E8D5B0',
                backgroundColor: 'rgba(232,213,176,0.08)',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid rgba(232,213,176,0.18)',
                fontFamily: 'sans-serif',
                letterSpacing: '0.04em',
              }}
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
