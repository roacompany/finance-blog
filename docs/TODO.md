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

- [x] **Floating 공유 버튼** — `FloatingShare.tsx`, `posts/[slug]/page.tsx`
  - 데스크톱 좌측 고정 아이콘 (Twitter, Facebook, 링크복사)

- [x] **Related Posts 배경색** — `RelatedPosts.tsx`
  - 이미 구현됨 (`bg-blue-50 rounded-2xl`)

- [x] **섹션별 배경색 차별화** — `page.tsx`
  - 시리즈별 배경색: 프롤로그(amber), 금리(blue), 대출(green)

## 미결 사항

### 콘텐츠 가이드라인 재수립
- [ ] **톤 통일** — 6/11개 포스트 `-ㅂ니다`/`-요` 혼용 → 일괄 `-요`체로 수정
- [ ] **Disclaimer 오타 수정** — 6개 포스트 "하시기 보세요" → 올바른 표현으로 교체
- [ ] **구조 명명 통일** — 핵심요약/3줄요약, FAQ, 관련 글, Disclaimer 명명 규칙 확정
- [ ] **가이드 문서 정비** — 실제 패턴(4종) 기준으로 템플릿 문서 축소·통합

### 콘텐츠 작성
- [ ] **허브 글 작성** — 10개 시리즈 중 미작성 허브 글 우선 작성
- [ ] **Deep Dive 확장** — 현재 11개 포스트 → 시리즈별 심층 글 추가

### 플러그인
- [ ] **agent-council 설치** — `/plugin install agent-council@team-attention-plugins`
- [ ] **ctx 플러그인 확인** — 정확한 이름/출처 확인 필요 (마켓플레이스에 미발견)
