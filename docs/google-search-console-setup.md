# Google Search Console 설정 가이드

## 1. Search Console 등록

### 1-1. 소유권 확인
1. https://search.google.com/search-console 접속
2. "속성 추가" 클릭
3. "URL 접두어" 선택: `https://www.roafinance.me`
4. 확인 방법 선택: **HTML 태그** (권장)

### 1-2. 메타 태그 추가
Search Console에서 제공하는 메타 태그를 복사:
```html
<meta name="google-site-verification" content="your-verification-code" />
```

`app/layout.tsx` 파일의 verification 객체에 추가:
```typescript
verification: {
  google: "your-verification-code",
},
```

## 2. Sitemap 제출

### 2-1. Sitemap URL
- **메인 Sitemap**: `https://www.roafinance.me/sitemap.xml`

### 2-2. 제출 방법
1. Search Console → Sitemaps
2. "새 사이트맵 추가"에 `sitemap.xml` 입력
3. "제출" 클릭

## 3. 구조화된 데이터 검증

### 3-1. 리치 결과 테스트
1. https://search.google.com/test/rich-results 접속
2. URL 입력: `https://www.roafinance.me`
3. "URL 테스트" 클릭
4. 오류 확인 및 수정

### 3-2. 구조화된 데이터 확인
현재 구현된 Schema.org 타입:
- **홈페이지**: Blog + BlogPosting 목록
- **포스트 페이지**: Article

## 4. 인덱싱 요청

### 4-1. URL 검사
1. Search Console → URL 검사
2. 각 페이지 URL 입력
3. "색인 생성 요청" 클릭

### 4-2. 우선순위 URL
```
https://www.roafinance.me/
https://www.roafinance.me/posts/interest-rate-101
https://www.roafinance.me/posts/treasury-yield-curve
https://www.roafinance.me/posts/bok-mpc-secret
https://www.roafinance.me/posts/cofix-vs-cd
```

## 5. 성능 모니터링

### 5-1. Core Web Vitals
목표 지표:
- **LCP** (Largest Contentful Paint): < 2.5초
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### 5-2. Search Console 보고서
- **실적**: 클릭수, 노출수, CTR, 평균 순위
- **커버리지**: 색인 생성된 페이지, 오류
- **개선사항**: Core Web Vitals, 모바일 사용성

## 6. SEO 체크리스트

### 6-1. 기술적 SEO
- [x] robots.txt 설정
- [x] sitemap.xml 생성
- [x] 구조화된 데이터 (JSON-LD)
- [x] OpenGraph 메타 태그
- [x] Twitter Card
- [x] Canonical URL
- [ ] Google Search Console 등록
- [ ] og-image.png 추가

### 6-2. 콘텐츠 SEO
- [x] 페이지별 고유한 title
- [x] 페이지별 고유한 description
- [x] 의미 있는 H1-H6 구조
- [x] 내부 링크 구조
- [x] 이미지 alt 속성

### 6-3. 성능 최적화
- [x] Next.js 이미지 최적화
- [x] Gzip/Brotli 압축
- [x] 코드 스플리팅
- [ ] CDN 사용 (Vercel 자동)
- [ ] 이미지 WebP/AVIF 변환

## 7. 주간 점검 사항

- [ ] 신규 포스트 인덱싱 확인
- [ ] 크롤링 오류 확인
- [ ] Core Web Vitals 모니터링
- [ ] 검색 쿼리 분석
- [ ] CTR 개선 기회 파악

## 8. 문제 해결

### 8-1. 페이지가 인덱싱되지 않는 경우
- robots.txt 확인
- sitemap.xml에 포함되어 있는지 확인
- URL 검사 도구로 수동 인덱싱 요청
- 24-48시간 대기

### 8-2. 구조화된 데이터 오류
- https://validator.schema.org 에서 JSON-LD 검증
- Rich Results Test로 재확인
- 필수 필드 누락 확인

## 참고 링크

- [Google Search Console](https://search.google.com/search-console)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Documentation](https://schema.org/)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
