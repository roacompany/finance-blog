"use client";

import { ReactNode } from "react";

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  return (
    <details
      style={{
        margin: '16px 0',
        borderRadius: '12px',
        border: '1px solid var(--roa-border)',
        backgroundColor: 'var(--roa-bg-elevated)',
        overflow: 'hidden',
      }}
      open={defaultOpen}
    >
      <summary
        style={{
          display: 'flex',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--roa-text-primary)',
          listStyle: 'none',
          backgroundColor: 'var(--roa-bg-overlay)',
        }}
      >
        <span>{title}</span>
        <svg
          style={{
            width: '16px',
            height: '16px',
            flexShrink: 0,
            color: 'var(--roa-text-tertiary)',
            transition: 'transform 0.2s',
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div
        style={{
          borderTop: '1px solid var(--roa-border)',
          padding: '16px 20px',
          fontSize: '15px',
          lineHeight: 1.7,
          color: 'var(--roa-text-secondary)',
          backgroundColor: 'var(--roa-bg-elevated)',
        }}
      >
        <div>{children}</div>
      </div>
    </details>
  );
}

interface AccordionGroupProps {
  children: ReactNode;
}

export function AccordionGroup({ children }: AccordionGroupProps) {
  return (
    <div style={{ margin: '24px 0' }}>
      {children}
    </div>
  );
}

export default Accordion;
