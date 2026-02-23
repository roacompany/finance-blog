# ROA Finance Blog

한국어 금융 교육 블로그. 복잡한 금융 개념을 쉽고 친근하게 설명하여 금융 문해력을 높인다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + 디자인 시스템 토큰 (`lib/design-system/`)
- **Content**: MDX (content/posts/)
- **Deploy**: Vercel (git push → PR → 자동 배포)

## 핵심 규칙

### 글쓰기
- → [ROA_WRITING_PRINCIPLES.md](./ROA_WRITING_PRINCIPLES.md) — 글쓰기 5원칙 (정확성, 간결성, 친근성, 실용성, 사실성)
- → [WRITING_TEMPLATES.md](./WRITING_TEMPLATES.md) — 토스 스타일 6종 템플릿 + 작성 가이드

### 개발·배포
- → [TECHNICAL_DEVELOPMENT_PRINCIPLES.md](./TECHNICAL_DEVELOPMENT_PRINCIPLES.md) — 배포 프로세스, 불확실성 처리, 토큰 절약
- → [rules/seo.md](./rules/seo.md) — SEO 체크리스트 (배포 전 필수 확인)

### 콘텐츠
- → [content/templates/post-template.mdx](./content/templates/post-template.mdx) — 정식 포스트 템플릿 (유일한 템플릿)
- → [content/backlog.md](./content/backlog.md) — 시리즈 로드맵

## 디자인 시스템

`lib/design-system/` 사용 필수. 하드코딩 색상 금지.

- `colors.ts` — 색상 토큰 (background, text, border, brand, semantic)
- `typography.ts` — 타이포그래피 토큰 (heading, body, caption)

## 배포 워크플로우

```
1. Feature 브랜치에서 작업
2. npm run build 로컬 검증
3. git push → PR 생성 (base: main)
4. Owner 검토 → Merge
5. Vercel 자동 프로덕션 배포
```

## 거버넌스

- AI는 초안·코드 작성만 수행
- 최종 발행(Merge)은 반드시 Owner가 직접 수행
- 불확실한 사항은 임의 진행하지 않고 Owner에게 확인
- 금융 수치·데이터는 반드시 출처 기반, 가짜 메트릭 금지

## 프로젝트 구조

```
content/posts/          — MDX 포스트 (11개)
content/templates/      — 포스트 템플릿
app/                    — Next.js App Router 페이지
components/             — React 컴포넌트
lib/design-system/      — 디자인 시스템 토큰
rules/                  — SEO 규칙
docs/                   — 운영 문서
docs/archive/           — 완료된 감사 보고서·스펙 문서
```
