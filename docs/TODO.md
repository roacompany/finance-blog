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

- [x] **네비게이션 링크 수정** — `Footer.tsx`
  - `/?filter=all` → `/` (미사용 파라미터 제거)

- [x] **영어 → 한글 통일** — `Footer.tsx`
  - "About"→"소개", "Contact"→"문의", "Privacy"→"개인정보처리방침"
  - Header.tsx, MobileMenu.tsx는 이미 한글 사용 중

- [x] **계산기 안내 문구 간소화** — `LoanCalculator.tsx`, `DsrCalculator.tsx`
  - `-ㅂ니다` 문체 → 토스 스타일 `-요` 간결 문체

## Medium Priority

- [x] **메인 타이틀 간소화** — `page.tsx`
  - 모바일: "로아의 시선" / 데스크톱: "금융답게 바라보기, 로아의 시선"

- [x] **빈 상태 메시지 통합** — `page.tsx`
  - 2문장 → "아직 글이 없어요." 1문장

- [x] **다음 글 CTA 버튼 추가** — `SeriesNav.tsx`
  - 이미 구현됨 (파란 CTA 버튼 + 화살표 아이콘)

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
