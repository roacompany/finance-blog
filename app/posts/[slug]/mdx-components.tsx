import Link from "next/link";
import Callout from "@/components/mdx/Callout";
import { Accordion } from "@/components/mdx/Accordion";
import { LoanCalculator, DsrCalculator } from "@/components/calculators";

export function useMDXComponents(components: any) {
  return {
    ...components,
    Callout,
    Accordion,
    LoanCalculator,
    DsrCalculator,
    blockquote: (props: any) => <Callout type="info">{props.children}</Callout>,

    p: ({ children }: any) => (
      <p style={{
        marginBottom: '24px',
        fontSize: '17px',
        lineHeight: 1.7,
        letterSpacing: '-0.01em',
        color: '#4E5968',
        wordBreak: 'keep-all',
      }}>
        {children}
      </p>
    ),
    h1: ({ children }: any) => (
      <h1 style={{
        marginTop: '48px',
        marginBottom: '32px',
        fontSize: '32px',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.02em',
        color: '#191F28',
      }}>
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 style={{
        marginTop: '48px',
        marginBottom: '16px',
        paddingBottom: '12px',
        fontSize: '24px',
        fontWeight: 700,
        lineHeight: 1.4,
        color: '#191F28',
        borderBottom: '1px solid #E5E8EB',
      }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{
        marginTop: '32px',
        marginBottom: '12px',
        fontSize: '20px',
        fontWeight: 700,
        lineHeight: 1.4,
        color: '#191F28',
      }}>
        {children}
      </h3>
    ),
    ul: ({ children }: any) => (
      <ul style={{
        marginBottom: '24px',
        paddingLeft: '24px',
        fontSize: '17px',
        lineHeight: 1.7,
        color: '#4E5968',
        listStyleType: 'disc',
      }}>
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol style={{
        marginBottom: '24px',
        paddingLeft: '24px',
        fontSize: '17px',
        lineHeight: 1.7,
        color: '#4E5968',
        listStyleType: 'decimal',
      }}>
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li style={{
        marginBottom: '8px',
        fontSize: '17px',
        lineHeight: 1.7,
        color: '#4E5968',
      }}>
        {children}
      </li>
    ),
    a: ({ href, children }: any) => (
      <Link
        href={href || "#"}
        style={{ color: '#3182F6', textDecoration: 'none', fontWeight: 500 }}
      >
        {children}
      </Link>
    ),
    // 테이블 - Light Mode
    table: ({ children }: any) => (
      <div style={{
        overflowX: 'auto',
        margin: '32px 0',
        borderRadius: '12px',
        border: '1px solid #E5E8EB',
        backgroundColor: '#FFFFFF',
      }}>
        <table style={{
          width: '100%',
          textAlign: 'left',
          fontSize: '15px',
          minWidth: '400px',
          borderCollapse: 'collapse',
        }}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead style={{
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #E5E8EB',
      }}>
        {children}
      </thead>
    ),
    th: ({ children }: any) => (
      <th style={{
        padding: '14px 16px',
        fontWeight: 600,
        fontSize: '14px',
        color: '#6B7684',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #E5E8EB',
      }}>
        {children}
      </th>
    ),
    tbody: ({ children }: any) => (
      <tbody>{children}</tbody>
    ),
    tr: ({ children }: any) => (
      <tr style={{ borderBottom: '1px solid #F2F4F6' }}>{children}</tr>
    ),
    td: ({ children }: any) => (
      <td style={{
        padding: '14px 16px',
        fontSize: '15px',
        color: '#4E5968',
        verticalAlign: 'top',
        lineHeight: 1.5,
      }}>
        {children}
      </td>
    ),
    // 인라인 코드 - Light Mode
    code: ({ children }: any) => (
      <code style={{
        padding: '3px 8px',
        borderRadius: '6px',
        backgroundColor: '#F2F4F6',
        fontSize: '14px',
        fontFamily: '"SF Mono", Menlo, monospace',
        color: '#191F28',
      }}>
        {children}
      </code>
    ),
    // 코드 블록 - Light Mode (Toss 스타일)
    pre: ({ children }: any) => (
      <pre style={{
        margin: '24px 0',
        padding: '20px 24px',
        borderRadius: '12px',
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E8EB',
        overflow: 'auto',
        fontSize: '14px',
        lineHeight: 1.7,
        color: '#4E5968',
        fontFamily: '"SF Mono", Menlo, monospace',
      }}>
        {children}
      </pre>
    ),
    hr: () => (
      <hr style={{ margin: '48px 0', border: 'none', borderTop: '1px solid #E5E8EB' }} />
    ),
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 700, color: '#191F28' }}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em style={{ fontStyle: 'italic', color: '#4E5968' }}>{children}</em>
    ),
  };
}
