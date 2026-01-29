# CLAUDE.md - AI Assistant Guidelines for finance-blog

> This document provides comprehensive guidelines for AI assistants working on the ROA Finance Blog project.

---

## Project Overview

**Name:** ROA Finance Blog (로아 파이낸스)
**Tagline:** "금융답게 바라보기, 로아의 시선" (Finance Viewed Properly - ROA's Perspective)
**Website:** https://www.roafinance.me
**Purpose:** Korean financial education blog making finance accessible through clear, friendly content

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.1 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS 4 + @tailwindcss/typography |
| Content | MDX with next-mdx-remote, gray-matter |
| Analytics | Microsoft Clarity |
| Deployment | Vercel (auto-deploy from GitHub) |

---

## Directory Structure

```
finance-blog/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage with post grid
│   ├── globals.css         # Global styles (Pretendard font)
│   ├── posts/[slug]/       # Dynamic blog post pages
│   ├── calculators/        # Financial calculator pages
│   └── (about|contact|privacy)/
├── components/
│   ├── layout/             # Header, Footer, MobileMenu
│   ├── ui/                 # Toss-style components (Button, Card, Badge, etc.)
│   ├── calculators/        # LoanCalculator, DsrCalculator
│   └── mdx/                # MDX components (Accordion, Callout)
├── lib/
│   ├── content.ts          # Post loading, metadata, reading time
│   ├── utils.ts            # Helper utilities
│   └── design-system/      # Centralized colors, typography, spacing
├── content/
│   ├── posts/              # MDX blog posts
│   └── templates/          # Post templates
├── rules/                  # Governance, SEO, trust rules
├── .claude/                # AI deployment workflow docs
└── public/                 # Static assets
```

---

## Essential Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Build for production (REQUIRED before deploy)
npm run lint      # Run ESLint
npm run start     # Start production server
```

**CRITICAL:** Always run `npm run build` before pushing. Build failures = deployment failures.

---

## Deployment Workflow

### Definition
**Deploy = Git Push + PR Link**

AI does NOT merge to main. User merges after review.

### Process
```bash
# 1. Build test (REQUIRED)
npm run build

# 2. Commit
git add -A
git commit -m "feat: description"

# 3. Push
git push -u origin claude/<feature>-<SESSION_ID>

# 4. Provide PR link to user
```

### Branch Naming
- **Required prefix:** `claude/`
- **Required suffix:** Session ID
- **Example:** `claude/add-post-ABC123`

### Commit Message Prefixes
| Prefix | Use Case |
|--------|----------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `refactor:` | Code restructuring |
| `docs:` | Documentation |
| `style:` | Formatting changes |

### After Push - Provide to User
```
✅ GitHub에 push 완료!

**브랜치**: claude/feature-ABC123
**커밋**: abc1234

👉 [PR 생성하기](https://github.com/roacompany/finance-blog/compare/main...claude/feature-ABC123)

**PR 제목**: feat: description
**PR 본문**: (content summary)
```

### Prohibited Actions
- ❌ Using `gh pr create` (not installed)
- ❌ Merging to main directly
- ❌ Saying "배포 완료" before providing PR link
- ❌ Vercel direct deployment mentions

---

## Writing Principles (ROA 5 Principles)

All content must follow these principles:

### 1. 정확성 (Accurate)
- All numbers must have official sources
- Mark estimates with "(추정)"
- Use verified calculation formulas
- ❌ No fabricated statistics or "AI-generated fake metrics"

### 2. 간결성 (Concise)
- Max 2 lines per sentence (mobile display)
- 3-4 sentences per paragraph
- Summaries in 3 lines or less
- ❌ No verbose expressions like "말씀드리자면"

### 3. 친근성 (Friendly)
- Use casual Korean: "~해요/이에요" (NOT "~입니다/합니다")
- Talk directly to the reader
- Use everyday analogies
- ❌ Avoid formal expressions like "귀하", "여러분"

### 4. 실용성 (Practical)
- Include specific number examples
- Add calculators for simulation
- Provide step-by-step guides
- ❌ Never end with "상황에 따라 다릅니다" alone

### 5. 사실성 (Factual)
- All statistics need sources
- If no data exists, state "정확한 통계는 없음"
- Clearly mark opinions with "제 생각에는~"
- ❌ Never use phrases like "대부분", "평균적으로" without data

### Tone Conversion Table
| Formal (❌) | Casual (✅) |
|-------------|-------------|
| ~입니다 | ~예요/이에요 |
| ~하십시오 | ~하세요/~해보세요 |
| ~할 수 있습니다 | ~할 수 있어요 |
| 귀하 | (omit) |
| 고려하시기 바랍니다 | 확인해보세요 |

---

## SEO Requirements

### Mandatory Sections (Pre-Deploy Check)
Every post MUST include:
- [ ] **TL;DR** - 3-5 key points at top
- [ ] **FAQ** - Minimum 3 Q&A pairs
- [ ] **Related Posts** - 2-3 internal links

### Metadata Rules
| Field | Requirement |
|-------|-------------|
| Title | ≤60 characters, include keyword |
| Description | ≤150 characters, include CTA |
| Slug | lowercase, hyphens, keyword-rich |
| H1 | Exactly 1 per page |

### Image Rules
- Alt text required on all images
- WebP format preferred
- Keywords in filenames

---

## MDX Post Format

```yaml
---
title: "제목 (≤60자)"
slug: "post-slug"
description: "설명 (≤150자)"
date: "2026-01-15"          # Publication date
base_date: "2026-01-15"     # Last modified
tags: ["금리", "예금"]       # For filtering
series: "Series 01. 금리"   # Series grouping
views: 890                   # Display count
---
```

### Custom MDX Components
Register in `/app/posts/[slug]/mdx-components.tsx`:
- `<Accordion>` - Collapsible sections
- `<Callout>` - Highlighted boxes
- `<LoanCalculator>` - Loan calculation tool
- `<DsrCalculator>` - DSR calculation tool
- `<TableWrapper>` - Responsive tables

---

## Design System

Use centralized design system from `/lib/design-system/`:

```typescript
import { colors, textColors, tagGradients } from '@/lib/design-system';
import { getCardClasses, getButtonClasses } from '@/lib/design-system/components';

// Colors
colors.tossBlue      // #3182F6
colors.textHigh      // #191F2B (titles)
colors.textBody      // #333D4B (body)
colors.textMid       // #8B95A1 (metadata)

// Component helpers
getCardClasses()     // Card styling
getTagGradient(tag)  // Tag gradient by category
```

---

## Governance Rules

### AI Limitations
1. **AI proposes drafts only** - User has final publishing authority
2. **File changes require approval** - Always confirm before modifications
3. **User owns content quality** - Final review responsibility is user's

### Uncertainty Handling
When uncertain, ALWAYS ask user. Situations requiring confirmation:
- New library/framework introduction
- Directory structure changes
- Financial calculations accuracy
- Build/deploy configuration changes

**Wrong approach:**
> "새로운 상태 관리를 위해 Zustand를 설치하겠습니다."

**Correct approach:**
> "상태 관리가 필요합니다. 옵션:
> 1. React Context (추가 의존성 없음)
> 2. Zustand (경량)
> 어떤 방식을 선호하시나요?"

---

## Common Error Cases

### Error #1: MDX Component Not Registered
```
Error: Expected component `LoanCalculator` to be defined
```
**Solution:** Add component to `/app/posts/[slug]/mdx-components.tsx`

### Error #2: Double Question Marks (??)
**Solution:**
```bash
sed -i 's/??/?/g' content/posts/*.mdx
```

### Pre-Deploy Verification
```bash
# Required checks before push
npm run build                              # Build test
grep -n "??" content/posts/*.mdx           # Check for ??
```

---

## Token Efficiency Guidelines

1. **Always verify locally before push** - Prevents rework
2. **Read files once** - Use parallel reads, avoid re-reading
3. **Reference documentation** - Don't re-analyze known patterns
4. **Use Explore agent** - For complex codebase searches

---

## Key Files Reference

| Purpose | File |
|---------|------|
| Writing principles | `ROA_WRITING_PRINCIPLES.md` |
| Deployment workflow | `.claude/deployment-workflow.md` |
| Error cases | `DEPLOYMENT_ERROR_CASES.md` |
| SEO rules | `rules/seo.md` |
| Governance | `rules/governance.md` |
| Content templates | `TOSS_STYLE_TEMPLATES.md` |
| Calculator guide | `CALCULATOR_GUIDE.md` |

---

## Pre-Work Checklist

Before starting any task:
- [ ] Read `ROA_WRITING_PRINCIPLES.md` (for content work)
- [ ] Check `DEPLOYMENT_ERROR_CASES.md`
- [ ] Identify uncertain areas

Before deployment:
- [ ] `npm run build` succeeds
- [ ] All changes committed
- [ ] PR link provided to user

---

## Quick Reference

**Language:** Korean (해요체)
**Deployment:** GitHub PR only (no direct merge)
**Build test:** Always required
**Content accuracy:** Sources required for all numbers
**Emoji usage:** Max 2-3 per section, headers only

---

*Last updated: 2026-01-29*
