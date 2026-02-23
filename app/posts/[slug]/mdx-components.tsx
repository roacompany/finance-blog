import Link from "next/link";
import Callout from "@/components/mdx/Callout";
import { Accordion } from "@/components/mdx/Accordion";
import { LoanCalculator, DsrCalculator } from "@/components/calculators";
import { colors } from "@/lib/design-system/colors";
import { typography } from "@/lib/design-system/typography";

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
        fontSize: typography.body.large.fontSize,
        lineHeight: typography.body.large.lineHeight,
        letterSpacing: typography.body.large.letterSpacing,
        color: typography.body.large.color,
        wordBreak: 'keep-all',
      }}>
        {children}
      </p>
    ),
    h1: ({ children }: any) => (
      <h1 style={{
        marginTop: '48px',
        marginBottom: '32px',
        fontSize: typography.heading.h1.fontSize,
        fontWeight: typography.heading.h1.fontWeight,
        lineHeight: typography.heading.h1.lineHeight,
        letterSpacing: typography.heading.h1.letterSpacing,
        color: colors.text.high,
      }}>
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 style={{
        marginTop: '48px',
        marginBottom: '16px',
        paddingBottom: '12px',
        fontSize: typography.heading.h2.fontSize,
        fontWeight: typography.heading.h2.fontWeight,
        lineHeight: typography.heading.h2.lineHeight,
        color: colors.text.high,
        borderBottom: `1px solid ${colors.border.default}`,
      }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{
        marginTop: '32px',
        marginBottom: '12px',
        fontSize: typography.heading.h3.fontSize,
        fontWeight: typography.heading.h3.fontWeight,
        lineHeight: typography.heading.h3.lineHeight,
        color: colors.text.high,
      }}>
        {children}
      </h3>
    ),
    ul: ({ children }: any) => (
      <ul style={{
        marginBottom: '24px',
        paddingLeft: '24px',
        fontSize: typography.body.large.fontSize,
        lineHeight: typography.body.large.lineHeight,
        color: typography.body.large.color,
        listStyleType: 'disc',
      }}>
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol style={{
        marginBottom: '24px',
        paddingLeft: '24px',
        fontSize: typography.body.large.fontSize,
        lineHeight: typography.body.large.lineHeight,
        color: typography.body.large.color,
        listStyleType: 'decimal',
      }}>
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li style={{
        marginBottom: '8px',
        fontSize: typography.body.large.fontSize,
        lineHeight: typography.body.large.lineHeight,
        color: typography.body.large.color,
      }}>
        {children}
      </li>
    ),
    a: ({ href, children }: any) => (
      <Link
        href={href || "#"}
        style={{ color: colors.brand.primary, textDecoration: 'none', fontWeight: 500 }}
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
        border: `1px solid ${colors.border.default}`,
        backgroundColor: colors.background.primary,
      }}>
        <table style={{
          width: '100%',
          textAlign: 'left',
          fontSize: typography.body.default.fontSize,
          minWidth: '400px',
          borderCollapse: 'collapse',
        }}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead style={{
        backgroundColor: colors.background.secondary,
        borderBottom: `1px solid ${colors.border.default}`,
      }}>
        {children}
      </thead>
    ),
    th: ({ children }: any) => (
      <th style={{
        padding: '14px 16px',
        fontWeight: 600,
        fontSize: typography.body.small.fontSize,
        color: typography.body.small.color,
        whiteSpace: 'nowrap',
        borderBottom: `1px solid ${colors.border.default}`,
      }}>
        {children}
      </th>
    ),
    tbody: ({ children }: any) => (
      <tbody>{children}</tbody>
    ),
    tr: ({ children }: any) => (
      <tr style={{ borderBottom: `1px solid ${colors.background.tertiary}` }}>{children}</tr>
    ),
    td: ({ children }: any) => (
      <td style={{
        padding: '14px 16px',
        fontSize: typography.body.default.fontSize,
        color: typography.body.large.color,
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
        backgroundColor: colors.background.tertiary,
        fontSize: typography.body.small.fontSize,
        fontFamily: typography.fontFamily.mono.join(', '),
        color: colors.text.high,
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
        backgroundColor: colors.background.secondary,
        border: `1px solid ${colors.border.default}`,
        overflow: 'auto',
        fontSize: typography.body.small.fontSize,
        lineHeight: 1.7,
        color: typography.body.large.color,
        fontFamily: typography.fontFamily.mono.join(', '),
      }}>
        {children}
      </pre>
    ),
    hr: () => (
      <hr style={{ margin: '48px 0', border: 'none', borderTop: `1px solid ${colors.border.default}` }} />
    ),
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 700, color: colors.text.high }}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em style={{ fontStyle: 'italic', color: typography.body.large.color }}>{children}</em>
    ),
  };
}
