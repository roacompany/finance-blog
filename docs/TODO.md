# 업무 대기목록

> UX Review Report 기반 개선 작업 목록.
> 최종 업데이트: 2026-02-23

---

## 완료

- [x] **P0-a**: 프로젝트 문서·코드 정리 — `e3f321d`
- [x] **P0-c**: 토스 스타일 피드 개편 (FeedTabs, HeroCard, PostCard 리디자인) — `264e0ab`
- [x] **P0-d**: UX/UI 정밀 개편 (Card → plain Link 전환) — `281b7bc`
- [x] **P0-e**: 미사용 디자인 시스템 dead code 정리 (142줄 삭제) — `063672f`, PR #54
- [x] **PC 목차 중복 수정**: 본문 내 TOC를 모바일 전용으로 변경 — `a28f33f`, PR #56

---

## High Priority

- [ ] **네비게이션 링크 수정** — `Header.tsx`
  - `/?filter=all` → `/` (미사용 파라미터 제거)

- [ ] **영어 → 한글 통일** — `Header.tsx`, `page.tsx`
  - "About"→"소개", "Contact"→"문의", "Insights"→"최신 글"

- [ ] **계산기 안내 문구 간소화** — `LoanCalculator.tsx`, `DsrCalculator.tsx`
  - 장황한 구어체 → 토스 스타일 간결 문체

## Medium Priority

- [ ] **메인 타이틀 간소화** — `page.tsx`
  - 모바일 2줄 → 1줄 (브랜딩 확인 필요)

- [ ] **빈 상태 메시지 통합** — `page.tsx`
  - 2문장 → 1문장

- [ ] **다음 글 CTA 버튼 추가** — `SeriesNav.tsx`
  - 시리즈 다음 글이 있을 때 큰 CTA 버튼

## Low Priority

- [ ] **Floating 공유 버튼** — `posts/[slug]/page.tsx`
  - 좌측 고정 공유 아이콘

- [ ] **Related Posts 배경색** — `RelatedPosts.tsx`
  - `bg-blue-50` 배경으로 시각적 차별화

- [ ] **섹션별 배경색 차별화** — `page.tsx`
  - 토스 피드 스타일 시리즈별 배경색

## 콘텐츠

- [ ] **허브 글 작성** — 10개 시리즈 중 미작성 허브 글 우선 작성
- [ ] **Deep Dive 확장** — 현재 11개 포스트 → 시리즈별 심층 글 추가
