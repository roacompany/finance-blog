import { ReactNode } from "react";

type CalloutType = "info" | "warning" | "danger";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const styles: Record<CalloutType, { bg: string; border: string; icon: string; title: string }> = {
  info: { bg: '#EFF6FF', border: '#BFDBFE', icon: '#3182F6', title: '#3182F6' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', icon: '#F59E0B', title: '#D97706' },
  danger: { bg: '#FEF2F2', border: '#FECACA', icon: '#EF4444', title: '#DC2626' },
};

export default function Callout({ type = "info", title, children }: CalloutProps) {
  const s = styles[type];

  return (
    <div style={{
      margin: '24px 0',
      padding: '20px',
      borderRadius: '16px',
      border: `1px solid ${s.border}`,
      backgroundColor: s.bg,
    }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{
          marginTop: '2px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: s.icon + '20',
          color: s.icon,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 700,
          flexShrink: 0,
        }}>
          !
        </div>
        <div style={{ flex: 1 }}>
          {title && (
            <strong style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: s.title, fontSize: '15px' }}>
              {title}
            </strong>
          )}
          {/* 본문 텍스트: #4E5968 통일 */}
          <div style={{
            fontSize: '15px',
            lineHeight: 1.7,
            color: '#4E5968',
          }}>
            <style>{`
              .callout-content ul, .callout-content ol {
                margin: 0;
                padding-left: 20px;
                color: #4E5968;
              }
              .callout-content li {
                margin-bottom: 6px;
                color: #4E5968;
              }
              .callout-content p {
                margin: 0;
                color: #4E5968;
              }
              .callout-content strong {
                color: #191F28;
                font-weight: 600;
              }
            `}</style>
            <div className="callout-content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Callout };
