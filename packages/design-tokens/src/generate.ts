/**
 * Design Token Generator
 * - output/web.css     → CSS custom properties
 * - output/ios/Colors.swift → Swift enum
 * - output/ios/Typography.swift → Swift typography
 */

import fs from 'fs';
import path from 'path';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

const OUT_DIR = path.resolve(__dirname, '../output');
const IOS_DIR = path.join(OUT_DIR, 'ios');

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(IOS_DIR, { recursive: true });

// ─── Helpers ────────────────────────────────────────────

function hexToRGBA(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function kebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/_/g, '-');
}

// ─── CSS Generator ──────────────────────────────────────

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const cssKey = prefix ? `${prefix}-${kebab(key)}` : kebab(key);
    if (typeof value === 'string') {
      result[cssKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, cssKey));
    }
  }
  return result;
}

function generateCSS(): string {
  const colorVars = flattenObject(colors as unknown as Record<string, unknown>, 'roa');
  const spacingVars = Object.entries(spacing).reduce<Record<string, string>>((acc, [k, v]) => {
    if (typeof v === 'string') acc[`roa-space-${k}`] = v;
    return acc;
  }, {});

  const vars = { ...colorVars, ...spacingVars };
  const lines = Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`);

  return `/* ROA Finance — Design Tokens (auto-generated) */\n:root {\n${lines.join('\n')}\n}\n`;
}

// ─── Swift Generator ────────────────────────────────────

function hexToSwift(hex: string): string {
  if (hex.startsWith('rgba')) return '/* rgba not supported */'
  const clean = hex.replace('#', '');
  const r = (parseInt(clean.slice(0, 2), 16) / 255).toFixed(3);
  const g = (parseInt(clean.slice(2, 4), 16) / 255).toFixed(3);
  const b = (parseInt(clean.slice(4, 6), 16) / 255).toFixed(3);
  return `Color(red: ${r}, green: ${g}, blue: ${b})`;
}

function generateSwiftColors(): string {
  const lines: string[] = [
    '// ROA Finance — Colors (auto-generated)',
    'import SwiftUI',
    '',
    'extension Color {',
    '  enum ROA {',
  ];

  function walk(obj: Record<string, unknown>, depth = 2) {
    for (const [key, value] of Object.entries(obj)) {
      const indent = '  '.repeat(depth);
      if (typeof value === 'string' && value.startsWith('#')) {
        lines.push(`${indent}static let ${key} = ${hexToSwift(value)}`);
      } else if (typeof value === 'object' && value !== null) {
        lines.push(`${indent}enum ${key.charAt(0).toUpperCase() + key.slice(1)} {`);
        walk(value as Record<string, unknown>, depth + 1);
        lines.push(`${indent}}`);
      }
    }
  }

  walk(colors as unknown as Record<string, unknown>);
  lines.push('  }', '}');
  return lines.join('\n') + '\n';
}

function generateSwiftTypography(): string {
  return `// ROA Finance — Typography (auto-generated)
import SwiftUI

extension Font {
  enum ROA {
    static let display  = Font.custom("PlayfairDisplay-Bold", size: 56)
    static let heading1 = Font.custom("PlayfairDisplay-Bold", size: 36)
    static let heading2 = Font.custom("PlayfairDisplay-SemiBold", size: 28)
    static let heading3 = Font.custom("Pretendard-SemiBold", size: 20)
    static let body     = Font.custom("Pretendard-Regular", size: 17)
    static let bodyLarge = Font.custom("Pretendard-Regular", size: 18)
    static let caption  = Font.custom("Pretendard-Regular", size: 13)
    static let label    = Font.custom("Pretendard-Medium", size: 12)
  }
}
`;
}

// ─── Write Files ────────────────────────────────────────

fs.writeFileSync(path.join(OUT_DIR, 'web.css'), generateCSS());
console.log('✓ output/web.css');

fs.writeFileSync(path.join(IOS_DIR, 'Colors.swift'), generateSwiftColors());
console.log('✓ output/ios/Colors.swift');

fs.writeFileSync(path.join(IOS_DIR, 'Typography.swift'), generateSwiftTypography());
console.log('✓ output/ios/Typography.swift');

console.log('\n✓ Design tokens generated successfully.');
