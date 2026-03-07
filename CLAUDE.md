# ROA Finance

> 금융을 깊이 이해하는 사람들을 위한 인사이트 미디어.
> WOW THE CUSTOMER — 매 화면, 매 문장, 매 인터랙션이 감탄을 만들어야 한다.

---

## 비전

롱블랙(longblack.co)처럼 — 정보를 소비하는 블로그가 아니라,
금융을 보는 눈을 갖게 되는 **프리미엄 인사이트 미디어**.

- **포지션**: 금융 중심 에디토리얼 미디어 (확장 가능: 비즈니스·라이프스타일)
- **구독 모델**: 수익화가 아닌 브랜드 포지셔닝 — "이 콘텐츠는 가입할 가치가 있다"
- **플랫폼**: Web + iOS Native (동일한 백엔드, 각 플랫폼 최고의 UX)
- **완성도 기준**: 하나씩, 완벽하게. 타협 없음.

---

## 아키텍처

### 모노레포 구조

```
roa-finance/                  ← 모노레포 루트 (Turborepo)
  apps/
    web/                      ← Next.js 15 (Web + Admin)
    ios/                      ← SwiftUI (iOS Native)
  packages/
    design-tokens/            ← 색상·간격·타이포 단일 정의
    api-types/                ← 공유 데이터 모델 스펙 (TypeScript)
    eslint-config/            ← 공통 린트 규칙
```

### 플랫폼별 역할

| 플랫폼 | 역할 | 비고 |
|--------|------|------|
| Web | 아티클 열람 + 멤버십 + SEO | Next.js 15 |
| Admin (Web) | 콘텐츠 발행·관리 → 즉시 반영 | Web 내 `/admin` |
| iOS | 네이티브 리딩 경험 | SwiftUI, 완전 네이티브 UX |
| Backend | Supabase (단일 소스) | Web·iOS 공통 사용 |

### 컴포넌트 CMS 아키텍처

모든 UI 컴포넌트는 Admin에서 제어 가능하다.

```
Supabase: page_components 테이블
  ├── component_key  (e.g. 'hero-today', 'series-carousel')
  ├── enabled        (on/off)
  ├── order          (렌더링 순서)
  └── config (JSONB) (제목, 부제, 색상, 링크 등 컴포넌트별 설정)
```

**Admin 기능**:
- 컴포넌트 토글 (enable/disable)
- 드래그로 순서 변경
- 클릭 → 콘텐츠 편집 (config JSON 기반 폼)

**Web 렌더링**:
- 홈 로드 시 Supabase에서 컴포넌트 config fetch
- config 기반으로 컴포넌트 동적 조합
- Realtime 구독 → Admin 변경 즉시 반영

**컴포넌트 레지스트리** (`lib/component-registry.ts`):
- 모든 컴포넌트를 key로 등록
- Admin에서 사용 가능한 컴포넌트 목록 자동 생성

### 즉시 반영 플로우

```
Admin 발행 → Supabase DB → Realtime → Web 즉시 업데이트
                                     → iOS Push Notification + 즉시 업데이트
```

---

## 기술 스택

### Web (`apps/web`)

| 영역 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + 디자인 토큰 |
| Content | MDX + Contentlayer |
| Auth | Supabase Auth |
| Realtime | Supabase Realtime |
| Deploy | Vercel |

### iOS (`apps/ios`)

| 영역 | 기술 |
|------|------|
| Framework | SwiftUI |
| Language | Swift 6.0 |
| Min Target | iOS 17+ |
| Backend | Supabase Swift SDK |
| Realtime | Supabase Realtime |
| Build | XcodeGen |

### 공유 패키지 (`packages/`)

| 패키지 | 내용 | 적용 |
|--------|------|------|
| `design-tokens` | 색상·간격·타이포 원본 정의 | Web: CSS vars / iOS: Swift enum |
| `api-types` | 데이터 모델 TypeScript 스펙 | Web 직접 사용 / iOS 참조 |

---

## 디자인 시스템

**하드코딩 색상·폰트·간격 절대 금지.** 반드시 `packages/design-tokens` 사용.

### 핵심 원칙

- **다크 퍼스트**: 배경 `#0A0A0A`, 텍스트 `#F5F5F5`
- **타이포그래피**: 제목 Serif, 본문 Sans-serif. 크기·행간이 곧 디자인
- **여백**: 콘텐츠가 숨 쉬어야 한다. 촘촘하게 채우지 않는다
- **애니메이션**: 있어야 할 곳에만. 과하면 제거
- **모바일 퍼스트**: 375px 기준 먼저 설계
- **iOS**: 네이티브 제스처·햅틱·트랜지션 최대 활용

### 토큰 파일 (`packages/design-tokens/`)

```
src/
  colors.ts       — 색상 (background, text, border, brand, semantic)
  typography.ts   — 타이포그래피 (display, heading, body, caption)
  spacing.ts      — 간격
  animation.ts    — 트랜지션·이징
output/
  web.css         — CSS 변수 (자동 생성)
  ios/Colors.swift  — Swift enum (자동 생성)
```

---

## 콘텐츠 모델

### 멤버십 구조

```
Today   — 당일 발행 콘텐츠 전체 무료 (누구나, SEO + 바이럴)
Archive — 이전 콘텐츠 멤버 전용 (이메일 가입, 무료)
```

**목적**: MAU 극대화 + 바이럴 성장. 당일 무료 공개로 공유를 유도하고,
아카이브 접근을 위해 자연스럽게 멤버십 전환.

### 포스트 유형

| 유형 | 설명 | 분량 |
|------|------|------|
| Letter | 짧고 예리한 인사이트 | 800~1,200자 |
| Deep Dive | 한 주제 완전 해부 | 3,000~6,000자 |
| Series | Hub + Deep Dive 묶음 | 무제한 |

---

## 글쓰기 원칙

→ [ROA_WRITING_PRINCIPLES.md](./ROA_WRITING_PRINCIPLES.md) 전문 참조

- 정확성: 모든 수치는 출처 기반. 가짜 메트릭 절대 금지
- 스토리텔링: 정보 나열 아님. 독자가 다음 문장을 읽고 싶게
- 톤: `-요`체 통일. `-ㅂ니다` 금지
- 길이: 필요한 만큼만. 짧아도 WOW면 충분

---

## 태스크 완료 기준 (Definition of Done)

> **WOW가 First다.** WOW를 통과하지 못하면 횟수 제한 없이 재작업한다.
> 검증 순서는 아래와 같으며, 하나라도 실패하면 다음 태스크로 진행하지 않는다.

---

### Step 1 — WOW 자가검증 (AI)

ROA Finance의 WOW는 3개의 순간으로 정의된다.

| WOW 순간 | 기준 |
|----------|------|
| #1 첫 화면 | 다크 에디토리얼 미감. "이게 금융 미디어야?" 인지 불일치가 일어나는가 |
| #2 읽는 경험 | 스크롤이 멈추지 않는가. 다음 문장이 당겨지는가. 마찰이 0인가 |
| #3 멤버십 전환 | 아카이브 페이월이 장벽이 아니라 자발적 가입 욕구를 만드는가 |

**판정**: 3개 모두 YES → 다음 Step 진행. 하나라도 NO → 즉시 재작업.

---

### Step 2 — 6개 레이어 검증 (AI)

**A. 코드 품질**
- lint errors 0, warnings 0
- type-check strict mode errors 0
- build 성공 + 번들 사이즈 이전 대비 +10% 초과 시 원인 분석
- 하드코딩 색상·간격·폰트 0건 (`packages/design-tokens` 사용 필수)
- 미사용 import·변수 0건

**B. 기능 동작**
- Happy path 전체 동작
- 빈 상태 / 에러 상태 / 로딩 상태 각각 확인
- 실제 Supabase 데이터로 검증 (mock 절대 금지)
- Today 무료 / Archive 멤버 전용 분기 정확히 동작
- Realtime: 발행 후 Web·iOS 반영 시간 측정

**C. 시각·디자인**
- 375px (mobile) / 768px (tablet) / 1280px (desktop) 3개 브레이크포인트 전수 확인
- 디자인 토큰 준수율 100%
- 다크 배경 텍스트 대비율 WCAG AA 이상
- 폰트 FOUT(Flash of Unstyled Text) 없음
- iOS: 시뮬레이터(iPhone 15 Pro) + 실기기 확인

**D. 회귀**
- 변경된 컴포넌트 의존 트리 파악 후 전수 확인
- 메인 피드 / 아티클 상세 / 멤버십 플로우 / 어드민 핵심 경로 매번 확인
- 이전 태스크 수정 사항 유지 여부 확인

**E. 성능**
- Web: LCP < 1.5s, CLS < 0.1, Lighthouse Performance > 90
- iOS: 60fps 스크롤, 메인 스레드 블로킹 없음
- 이미지: WebP + lazy loading + 적절한 sizes 속성

**F. 콘텐츠**
- 금융 수치: 출처 없으면 게시 불가
- 날짜·시점: base_date 기준 명확히 표기
- 계산식: 검증된 공식만 사용
- 문체: `-요`체 100%, Disclaimer 필수

---

### Step 3 — Owner 최종 확인

AI 자가검증 통과 후 Owner에게 전달. Owner가 최종 WOW 판정.
- Owner YES → PR Merge → 배포
- Owner NO → 피드백 기반 재작업 → Step 1부터 재시작

---

### 버그 추적 원칙

검증 중 발견된 모든 버그는 **태스크 범위와 무관하게 반드시 티켓 등록**.
이력 추적이 목적이며, 즉시 작업 여부는 Owner가 결정한다.

**티켓 필수 항목**:
- 발견 시각 / 발견 경위
- 원인 (알 수 있는 범위)
- 오류 증상
- 영향도 (어느 기능·화면에 영향을 주는가)
- 우선순위 (Critical / High / Medium / Low)
- 이후 작업 연계 시 영향도
- 즉시 작업 안 할 경우: 등록 시각·경과 시간 기록 후 추적 관리

**버그 처리 흐름**:
```
버그 발견 → 티켓 등록 → Owner에게 즉시 작업 여부 문의 → Owner 결정
  ├── 즉시 작업: 현재 태스크 일시 중단 → 버그 수정 → 검증 → 재개
  └── 보류: 티켓에 시각 기록 → 추적 관리 → 현재 태스크 계속
```

---

## 배포 워크플로우

### Web
```
feature 브랜치 → [Definition of Done 전체 통과] → PR → Owner Merge → Vercel 자동 배포
```

### iOS
```
feature 브랜치 → [Definition of Done 전체 통과] → PR → Owner Merge → TestFlight → App Store
```

---

## 거버넌스

- AI는 초안·코드 작성만 수행
- 최종 발행(Merge / App Store 제출)은 반드시 Owner가 직접
- 불확실하면 임의 진행 금지 — Owner에게 확인
- 금융 수치·데이터: 반드시 출처 기반, 가짜 메트릭 금지
- **작업 원칙**: 하나씩, 완벽하게. 완성도 타협 없음

---

## 개편 로드맵

### Phase 1 — Monorepo Foundation
- [ ] Turborepo 모노레포 셋업
- [ ] `packages/design-tokens` 구축 (Web CSS vars + iOS Swift enum 자동 생성)
- [ ] `packages/api-types` 데이터 모델 정의
- [ ] Supabase 스키마 설계 (posts, members, series)

### Phase 2 — Web: Editorial Redesign
- [x] 디자인 시스템 재설계 (다크 에디토리얼 토큰)
- [x] Header / Footer / Layout 전면 재설계
- [ ] Today Hero + 자정 카운트다운 (롱블랙 차용)
- [ ] 시리즈 수평 캐러셀
- [ ] 아티클 상세 — 읽기 진행 바 + 페이월 모달
- [ ] 멤버십 페이월 + Supabase Auth

### Phase 3 — Component CMS + Admin
- [ ] Supabase 스키마 — posts, series, page_components, members
- [ ] 컴포넌트 레지스트리 — 모든 UI 컴포넌트 등록
- [ ] Admin 페이지 빌더 — 컴포넌트 on/off + 순서 변경 + 콘텐츠 편집
- [ ] 동적 홈 렌더러 — Supabase config 기반 컴포넌트 조합
- [ ] Supabase Realtime → Admin 변경 즉시 Web 반영
- [ ] Realtime → iOS Push Notification

### Phase 4 — iOS: Native App
- [ ] XcodeGen 프로젝트 셋업
- [ ] 디자인 토큰 Swift 적용
- [ ] 메인 피드 (SwiftUI)
- [ ] 아티클 상세 — 네이티브 리딩 경험
- [ ] 멤버십 로그인 + 페이월
- [ ] Supabase Realtime 구독

### Phase 5 — Polish
- [ ] 마이크로 인터랙션 (Web: Framer Motion / iOS: 네이티브 애니메이션)
- [ ] 뉴스레터 연동 (Resend)
- [ ] SEO 완성 (OG 이미지 동적 생성, sitemap)
- [ ] 성능 최적화 (Web LCP < 1.5s / iOS 60fps)
- [ ] 기존 11개 포스트 문체 통일 (`-요`체)
