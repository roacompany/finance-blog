# Google E-E-A-T 검증 보고서

## 1. E-E-A-T 개요

### Google E-E-A-T란?

[Google E-E-A-T](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)는 Google 검색 품질 평가자가 콘텐츠 품질을 평가하는 4가지 기준입니다:

1. **Experience (경험)**: 실제 경험을 바탕으로 작성되었는가
2. **Expertise (전문성)**: 해당 분야의 전문 지식이 있는가
3. **Authoritativeness (권위성)**: 해당 분야에서 인정받는 출처인가
4. **Trustworthiness (신뢰성)**: 정확하고 신뢰할 수 있는 정보인가

**Trust가 가장 중요**: "신뢰할 수 없는 페이지는 E-E-A-T가 낮습니다. 얼마나 경험이 많고, 전문적이고, 권위적이더라도 말이죠." ([SEO-Kreativ](https://www.seo-kreativ.de/en/blog/e-e-a-t-guide-for-more-trust-and-top-rankings/))

### YMYL (Your Money Your Life) 콘텐츠

**금융 블로그는 YMYL 카테고리**에 속하므로 E-E-A-T 요구사항이 가장 높습니다.
[2025년 9월 업데이트](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)에서 YMYL 범위가 확대되었습니다.

---

## 2. 현재 블로그 E-E-A-T 분석

### ✅ 잘하고 있는 점

#### 1. Trustworthiness (신뢰성) - 부분적 우수

**출처 명시**:
- 모든 포스트에 공식 출처 링크 제공
- 예: `hello-world.mdx`
  ```markdown
  **출처:**
  - [한국은행 기준금리](https://www.bok.or.kr)
  - [금융감독원 금융교육](https://www.fss.or.kr)
  ```

**Disclaimer**:
- `hello-world.mdx`에 명확한 면책 조항
  ```markdown
  본 글은 정보 제공 목적으로 작성되었으며, 투자 권유나 금융 조언이 아니에요.
  실제 투자 결정은 전문가와 상담 후 본인의 판단 하에 이루어져야 해요.
  ```

**메타데이터 완비**:
- `layout.tsx`에 author, publisher, canonical URL 등록
- JSON-LD 구조화 데이터 (Article Schema)

#### 2. Expertise (전문성) - 양호

**정확한 금융 정보**:
- 공식 기관 데이터 인용 (한국은행, 금융감독원, SKT/KT/LG U+ 공식 페이지)
- 계산 예시 제공 (DSR, LTV, 대출 이자 등)
- 2025/2026년 최신 정보 반영

**실용적 도구**:
- DsrCalculator, LoanCalculator 등 실제 사용 가능한 계산기 제공

---

### ❌ 개선 필요 사항

#### 1. Experience (경험) - 미흡 ⚠️

**문제점**:
- 저자의 실제 경험이 명시되지 않음
- "로아"가 누구인지, 어떤 배경을 가졌는지 불명확
- 1인칭 경험담 부족

**개선 방안**:
- About 페이지 추가
- 저자의 금융 경력, 자격증, 실무 경험 명시
- 일부 포스트에 개인 경험담 추가 (예: "실제로 제가 일본 여행 갔을 때...")

#### 2. Expertise (전문성) - 개선 필요 ⚠️

**문제점**:
- 저자의 자격증명(Credentials) 없음
- 전문가로서의 권위 없음
- 연락처/이메일 없음

**개선 방안**:
- About 페이지에 자격증 명시
  - 예: "금융 분석가 자격증(CFA, CFP)"
  - 예: "○○대학교 경제학과 졸업"
  - 예: "△△은행 ○년 근무 경력"
- 이메일/SNS 연락처 제공
- 외부 인터뷰나 기고 내역 추가

#### 3. Authoritativeness (권위성) - 미흡 ⚠️

**문제점**:
- 저자 프로필 페이지 없음
- 외부 인용이나 백링크 없음
- 미디어 노출 없음

**개선 방안**:
- `/about` 또는 `/author/roa` 페이지 생성
- 외부 기고 또는 인터뷰 추가
- LinkedIn, 블로그 등 외부 프로필 연결

#### 4. Trustworthiness (신뢰성) - 개선 필요 ⚠️

**문제점**:
- Disclaimer가 `hello-world.mdx`에만 존재
- 다른 포스트에는 면책 조항 없음
- 업데이트 날짜 표시 불명확

**개선 방안**:
- 모든 YMYL 포스트에 Disclaimer 추가
- `base_date`와 `date`의 차이 명확히 표시 ("최초 작성일", "최종 수정일")
- Footer에 전체 사이트 Disclaimer 추가

---

## 3. E-E-A-T 체크리스트 (현재 상태)

| 항목 | 현재 상태 | 개선 필요 |
|------|-----------|----------|
| **Experience (경험)** | | |
| 저자의 실제 경험 명시 | ❌ | ✅ About 페이지에 경력 추가 |
| 1인칭 경험담 포함 | ⚠️ 부분 | ✅ 일부 포스트에 개인 경험 추가 |
| **Expertise (전문성)** | | |
| 저자 자격증/학력 명시 | ❌ | ✅ About 페이지에 자격증명 추가 |
| 전문 분야 명확 | ✅ 금융 | - |
| 정확한 정보 제공 | ✅ | - |
| 계산기/도구 제공 | ✅ | - |
| **Authoritativeness (권위성)** | | |
| 저자 프로필 페이지 | ❌ | ✅ /about 페이지 생성 |
| 외부 인용/백링크 | ❌ | ✅ 외부 기고 추가 |
| 연락처 정보 | ❌ | ✅ 이메일/SNS 추가 |
| **Trustworthiness (신뢰성)** | | |
| 출처 명시 | ✅ | - |
| Disclaimer | ⚠️ 부분 | ✅ 모든 YMYL 포스트에 추가 |
| 업데이트 날짜 표시 | ⚠️ 불명확 | ✅ 명확하게 표시 |
| HTTPS | ✅ | - |
| 개인정보 보호 정책 | ❌ | ✅ Privacy Policy 페이지 추가 |

---

## 4. 즉시 개선 가능한 항목

### 우선순위 1: About 페이지 생성 (가장 중요)

**필수 포함 내용**:
1. 저자 소개 (이름, 배경)
2. 전문성 입증 (경력, 자격증, 학력)
3. 블로그 목적 및 미션
4. 연락처 (이메일, SNS)

**예시 구조**:
```markdown
# 로아(ROA) 소개

## 금융을 금융답게 바라보는 사람

안녕하세요. 금융 블로거 로아입니다.

### 경력
- ○○은행 자산관리팀 ○년 근무
- 개인 투자자로 ○년 경험
- [선택] CFA/CFP 자격증 보유

### 블로그 목적
금융 지식의 격차를 줄이고, 누구나 쉽게 이해할 수 있는 금융 정보를 제공합니다.

### 연락처
- 이메일: roa@roafinance.me
- Twitter: @roa_finance
```

### 우선순위 2: Disclaimer 템플릿 추가

**모든 YMYL 포스트에 추가**:
```markdown
---

## Disclaimer

본 글은 정보 제공 목적으로 작성되었으며, 투자 권유나 금융 조언이 아닙니다.
실제 투자 결정은 전문가와 상담 후 본인의 판단 하에 이루어져야 합니다.
작성일 기준 정보이며, 관련 법규나 제도는 변경될 수 있습니다.

**최초 작성**: {date}
**최종 수정**: {base_date}
```

### 우선순위 3: Footer 개선

**현재**: 단순 저작권만 표시
**개선**:
```jsx
<footer>
  <div>
    <Link href="/about">About</Link>
    <Link href="/privacy">Privacy Policy</Link>
    <Link href="/disclaimer">Disclaimer</Link>
    <Link href="/contact">Contact</Link>
  </div>
  <p>Financial Tech Blog © 2026</p>
  <p>
    본 사이트의 모든 정보는 교육 목적으로 제공되며,
    투자 권유가 아닙니다.
  </p>
</footer>
```

---

## 5. 장기 개선 권장 사항

### 1. 저자 프로필 강화
- LinkedIn 프로필 연결
- 외부 기고 실적 추가
- 미디어 인터뷰 추가

### 2. 사용자 신뢰 구축
- 댓글 기능 추가
- 사용자 리뷰/피드백 수집
- 이메일 뉴스레터 구독

### 3. 콘텐츠 품질 관리
- 정기적인 사실 확인 프로세스
- 오래된 포스트 업데이트 정책
- 외부 전문가 검토

---

## 6. 경쟁사 벤치마킹

### 우수 사례: Investopedia

**E-E-A-T 우수 요소**:
- 각 아티클에 저자 프로필 링크
- 저자의 자격증(CFA, CFP) 명시
- 전문가 검토 프로세스 표시 ("Reviewed by [전문가]")
- 명확한 업데이트 날짜
- About 페이지에 팀 소개

---

## 7. 결론 및 권장 액션

### 현재 E-E-A-T 점수 (주관적 평가)

| 항목 | 점수 | 평가 |
|------|------|------|
| Experience | 3/10 | 매우 미흡 |
| Expertise | 6/10 | 보통 |
| Authoritativeness | 3/10 | 매우 미흡 |
| Trustworthiness | 7/10 | 양호 |
| **전체** | **4.75/10** | **개선 필요** |

### 즉시 실행 액션 (1주일 내)

- [ ] About 페이지 생성 (`app/about/page.tsx`)
- [ ] 모든 YMYL 포스트에 Disclaimer 추가
- [ ] Footer에 법적 링크 추가 (Privacy, Disclaimer, Contact)
- [ ] `overseas-roaming-risk-management.mdx`에 Disclaimer 추가

### 단기 액션 (1개월 내)

- [ ] Privacy Policy 페이지 작성
- [ ] Contact 페이지 작성
- [ ] 저자 이메일 공개
- [ ] 기존 포스트에 "최초 작성" / "최종 수정" 명확히 표시

### 중기 액션 (3개월 내)

- [ ] LinkedIn 프로필 생성 및 연결
- [ ] 외부 기고 1건 이상
- [ ] 사용자 피드백 시스템 구축

---

## 8. 참고 자료

- [Google E-E-A-T Guidelines](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Search Quality Rater Guidelines (2025.09)](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)
- [E-E-A-T Ultimate Guide](https://www.seo-kreativ.de/en/blog/e-e-a-t-guide-for-more-trust-and-top-rankings/)
- [Search Engine Journal: E-E-A-T](https://www.searchenginejournal.com/google-e-e-a-t-how-to-demonstrate-first-hand-experience/474446/)
