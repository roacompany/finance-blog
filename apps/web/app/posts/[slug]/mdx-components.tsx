import Link from 'next/link';
import dynamic from 'next/dynamic';
import Callout from '@/components/mdx/Callout';
import { Accordion } from '@/components/mdx/Accordion';

// 무거운 계산기 컴포넌트 — 실제 사용 포스트에서만 코드 스플릿
const LoanCalculator = dynamic(
  () => import('@/components/calculators/LoanCalculator'),
  { loading: () => <div style={{ height: '320px', borderRadius: '12px', background: 'var(--roa-bg-elevated)' }} /> }
);
const DsrCalculator = dynamic(
  () => import('@/components/calculators/DsrCalculator'),
  { loading: () => <div style={{ height: '320px', borderRadius: '12px', background: 'var(--roa-bg-elevated)' }} /> }
);

type MdxProps = { children?: React.ReactNode };
type AnchorProps = { href?: string; children?: React.ReactNode };

export function getMDXComponents(components: Record<string, unknown>) {
  return {
    ...components,
    Callout,
    Accordion,
    LoanCalculator,
    DsrCalculator,
    blockquote: ({ children }: MdxProps) => <Callout type="info">{children}</Callout>,


    p: ({ children }: MdxProps) => (
      <p style={{ marginBottom: '1.5rem', lineHeight: 1.9, color: 'var(--roa-text-secondary)', wordBreak: 'keep-all' }}>
        {children}
      </p>
    ),
    h1: ({ children }: MdxProps) => (
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: 700, color: 'var(--roa-text-primary)', marginTop: '3rem', marginBottom: '1.25rem', letterSpacing: '-0.025em' }}>
        {children}
      </h1>
    ),
    h2: ({ children }: MdxProps) => (
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--roa-text-primary)', marginTop: '3rem', marginBottom: '1rem', paddingBottom: '0.625rem', borderBottom: '1px solid var(--roa-border-subtle)' }}>
        {children}
      </h2>
    ),
    h3: ({ children }: MdxProps) => (
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--roa-text-primary)', marginTop: '2rem', marginBottom: '0.75rem' }}>
        {children}
      </h3>
    ),
    ul: ({ children }: MdxProps) => (
      <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', listStyleType: 'disc', color: 'var(--roa-text-secondary)', lineHeight: 1.85 }}>
        {children}
      </ul>
    ),
    ol: ({ children }: MdxProps) => (
      <ol style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', listStyleType: 'decimal', color: 'var(--roa-text-secondary)', lineHeight: 1.85 }}>
        {children}
      </ol>
    ),
    li: ({ children }: MdxProps) => (
      <li style={{ marginBottom: '0.5rem', color: 'var(--roa-text-secondary)', lineHeight: 1.85 }}>{children}</li>
    ),
    strong: ({ children }: MdxProps) => (
      <strong style={{ fontWeight: 700, color: 'var(--roa-text-accent)' }}>{children}</strong>
    ),
    em: ({ children }: MdxProps) => (
      <em style={{ fontStyle: 'italic', color: 'var(--roa-text-secondary)' }}>{children}</em>
    ),
    a: ({ href, children }: AnchorProps) => (
      <Link href={href ?? '#'} className="roa-link-gold" style={{ textDecoration: 'underline', textDecorationThickness: '1px', textUnderlineOffset: '3px' }}>
        {children}
      </Link>
    ),
    hr: () => (
      <hr style={{ border: 'none', borderTop: '1px solid var(--roa-border-subtle)', margin: '3rem 0' }} />
    ),
    code: ({ children }: MdxProps) => (
      <code style={{ backgroundColor: 'var(--roa-bg-elevated)', border: '1px solid var(--roa-border)', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.875em', color: 'var(--roa-gold)', fontFamily: 'ui-monospace, monospace' }}>
        {children}
      </code>
    ),
    pre: ({ children }: MdxProps) => (
      <pre style={{ margin: '1.5rem 0', padding: '1.25rem 1.5rem', borderRadius: '12px', backgroundColor: 'var(--roa-bg-elevated)', border: '1px solid var(--roa-border)', overflow: 'auto', fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--roa-text-secondary)', fontFamily: 'ui-monospace, monospace' }}>
        {children}
      </pre>
    ),
    table: ({ children }: MdxProps) => (
      <div style={{ overflowX: 'auto', margin: '2rem 0', borderRadius: '12px', border: '1px solid var(--roa-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>{children}</table>
      </div>
    ),
    thead: ({ children }: MdxProps) => (
      <thead style={{ backgroundColor: 'var(--roa-bg-elevated)', borderBottom: '1px solid var(--roa-border)' }}>{children}</thead>
    ),
    th: ({ children }: MdxProps) => (
      <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--roa-text-primary)', textAlign: 'left', fontSize: '0.875rem' }}>{children}</th>
    ),
    tbody: ({ children }: MdxProps) => <tbody>{children}</tbody>,
    tr: ({ children }: MdxProps) => (
      <tr style={{ borderBottom: '1px solid var(--roa-border-subtle)' }}>{children}</tr>
    ),
    td: ({ children }: MdxProps) => (
      <td style={{ padding: '12px 16px', color: 'var(--roa-text-secondary)', lineHeight: 1.6, verticalAlign: 'top' }}>{children}</td>
    ),
  };
}
