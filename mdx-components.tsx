import type { MDXComponents } from 'mdx/types';
import Accordion from '@/components/mdx/Accordion';
import Callout from '@/components/mdx/Callout';
import { LoanCalculator, DsrCalculator } from '@/components/calculators';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Accordion,
    Callout,
    LoanCalculator,
    DsrCalculator,
    ...components,
  };
}
