import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '금융답게 바라보기, 로아의 시선';
  const description = searchParams.get('desc') || '';
  const tags = searchParams.get('tags') || '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            R
          </div>
          <span style={{ fontSize: '18px', color: '#6b7280', fontWeight: 500 }}>
            금융답게 바라보기, 로아의 시선
          </span>
        </div>

        {/* Middle: Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: title.length > 30 ? '42px' : '52px',
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.3,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: '22px',
                color: '#6b7280',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {description.length > 80 ? description.slice(0, 80) + '...' : description}
            </p>
          )}
        </div>

        {/* Bottom: Tags + URL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {tags.split(',').filter(Boolean).slice(0, 4).map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: '14px',
                  color: '#3b82f6',
                  backgroundColor: '#eff6ff',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontWeight: 600,
                }}
              >
                {tag.trim()}
              </span>
            ))}
          </div>
          <span style={{ fontSize: '16px', color: '#9ca3af' }}>
            roafinance.me
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
