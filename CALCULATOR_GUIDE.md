# 금융 계산기 구현 가이드

> 토스 스타일의 인터랙티브 금융 계산기를 블로그에 추가하는 방법

---

## 계획 개요

### 구현할 계산기 목록

1. **대출 이자 계산기** (`LoanCalculator`)
   - 원리금균등, 원금균등, 만기일시 상환 지원
   - 고정/변동/혼합 금리 옵션

2. **예적금 계산기** (`SavingsCalculator`)
   - 목표 금액 달성 기간 계산
   - 월 납입액별 만기 금액 비교

3. **복리 계산기** (`CompoundInterestCalculator`)
   - 복리 효과 시각화
   - 단리 vs 복리 비교

### 기술 스택

- **React 18**: 클라이언트 컴포넌트
- **TypeScript**: 타입 안전성
- **Inline Styles**: 기존 디자인 시스템 일관성 유지
- **Chart.js** (선택): 시각화가 필요한 경우

---

## 구현 방법

### Step 1: 계산기 컴포넌트 생성

각 계산기를 `components/calculators/` 디렉토리에 생성합니다.

**파일 구조:**
```
components/
  calculators/
    LoanCalculator.tsx        # 대출 이자 계산기
    SavingsCalculator.tsx     # 예적금 계산기
    CompoundInterestCalculator.tsx  # 복리 계산기
    CalculatorLayout.tsx      # 공통 레이아웃
    index.ts                  # Export 모음
```

### Step 2: MDX에서 사용

**mdx-components.tsx에 등록:**
```tsx
import { LoanCalculator, SavingsCalculator, CompoundInterestCalculator } from '@/components/calculators';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 기존 컴포넌트들...
    LoanCalculator,
    SavingsCalculator,
    CompoundInterestCalculator,
    ...components,
  };
}
```

**MDX 포스트에서 사용:**
```markdown
# 대출 이자 계산해보기

직접 계산해보세요!

<LoanCalculator />

계산 결과를 바탕으로...
```

### Step 3: 공통 디자인 시스템

모든 계산기는 일관된 스타일을 사용합니다.

**색상 팔레트:**
```typescript
const colors = {
  primary: '#3182F6',      // 토스 블루
  background: '#F9FAFB',   // 배경
  border: '#E5E8EB',       // 테두리
  text: {
    primary: '#191F28',    // 본문
    secondary: '#4E5968',  // 보조
    tertiary: '#8B95A1',   // 비활성
  },
  success: '#12B564',      // 성공
  warning: '#F59E0B',      // 경고
  error: '#EF4444',        // 오류
};
```

---

## 계산기 1: 대출 이자 계산기

### 기능 명세

**입력값:**
- 대출 금액 (원)
- 연 이자율 (%)
- 대출 기간 (개월)
- 상환 방식 (원리금균등/원금균등/만기일시)

**출력값:**
- 월 상환액
- 총 상환액
- 총 이자액
- 상환 스케줄 (선택사항)

### 계산 공식

#### 1. 원리금균등 상환

```
월 상환액 = P × r × (1 + r)^n / ((1 + r)^n - 1)

P = 대출 원금
r = 월 이자율 (연 이자율 / 12 / 100)
n = 대출 기간 (개월)
```

#### 2. 원금균등 상환

```
월 원금 상환액 = P / n
월 이자 = 잔여 원금 × r
월 상환액 = 월 원금 상환액 + 월 이자
```

#### 3. 만기일시 상환

```
월 이자 = P × r
만기 상환액 = P + (P × r × n)
```

### 컴포넌트 구조

```tsx
'use client';

import { useState } from 'react';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(10000000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanPeriod, setLoanPeriod] = useState(12);
  const [repaymentType, setRepaymentType] = useState<'equal' | 'principal' | 'maturity'>('equal');

  const calculateMonthlyPayment = () => {
    // 계산 로직
  };

  return (
    <div style={{ ... }}>
      {/* 입력 필드들 */}
      {/* 계산 결과 */}
    </div>
  );
}
```

---

## 계산기 2: 예적금 계산기

### 기능 명세

**입력값:**
- 월 납입액 (원)
- 연 이자율 (%)
- 적금 기간 (개월)

**출력값:**
- 총 납입액
- 이자 수령액
- 만기 수령액
- 실질 수익률 (세후)

### 계산 공식

```
만기 수령액 = Σ(월 납입액 × (1 + 월이자율)^(n-i+1))

n = 총 기간 (개월)
i = 현재 월차 (1부터 n까지)
월이자율 = 연이자율 / 12 / 100
```

**세후 이자:**
```
이자소득세 = 이자 × 15.4%
세후 이자 = 이자 × (1 - 0.154)
```

---

## 계산기 3: 복리 계산기

### 기능 명세

**입력값:**
- 초기 투자금 (원)
- 연 수익률 (%)
- 투자 기간 (년)
- 복리 주기 (연/월/일)

**출력값:**
- 최종 금액
- 총 수익
- 단리 대비 차이
- 기간별 추이 그래프

### 계산 공식

```
복리 최종 금액 = P × (1 + r/n)^(n×t)

P = 원금
r = 연 이자율 (소수점)
n = 연간 복리 횟수
t = 기간 (년)
```

**단리 계산:**
```
단리 최종 금액 = P × (1 + r × t)
```

---

## 공통 UI 컴포넌트

### 1. 입력 필드 (NumberInput)

```tsx
interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

function NumberInput({ label, value, onChange, unit, min, max, step }: NumberInputProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#191F28'
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          style={{
            width: '100%',
            padding: '12px',
            paddingRight: unit ? '60px' : '12px',
            fontSize: '16px',
            border: '1px solid #E5E8EB',
            borderRadius: '12px',
            outline: 'none',
          }}
        />
        {unit && (
          <span style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#8B95A1',
            fontSize: '14px',
          }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
```

### 2. 선택 버튼 (SegmentedControl)

```tsx
interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onChange: (value: T) => void;
}

function SegmentedControl<T extends string>({ options, selected, onChange }: SegmentedControlProps<T>) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      padding: '4px',
      backgroundColor: '#F9FAFB',
      borderRadius: '12px',
    }}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: selected === option.value ? '#FFFFFF' : 'transparent',
            color: selected === option.value ? '#3182F6' : '#8B95A1',
            boxShadow: selected === option.value ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
```

### 3. 결과 표시 (ResultCard)

```tsx
interface ResultCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function ResultCard({ label, value, highlight }: ResultCardProps) {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: highlight ? '#EFF6FF' : '#F9FAFB',
      border: highlight ? '2px solid #3182F6' : '1px solid #E5E8EB',
      borderRadius: '16px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '13px',
        color: '#8B95A1',
        marginBottom: '8px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: highlight ? '28px' : '24px',
        fontWeight: 700,
        color: highlight ? '#3182F6' : '#191F28',
      }}>
        {value}
      </div>
    </div>
  );
}
```

---

## 구현 우선순위

### Phase 1: 기본 구현 (1-2시간)
- [ ] 대출 이자 계산기 (원리금균등 방식만)
- [ ] 공통 UI 컴포넌트 (NumberInput, ResultCard)
- [ ] MDX 연동 테스트

### Phase 2: 기능 확장 (2-3시간)
- [ ] 대출 계산기 3가지 상환 방식 추가
- [ ] 예적금 계산기 구현
- [ ] SegmentedControl 컴포넌트 추가

### Phase 3: 고급 기능 (3-4시간)
- [ ] 복리 계산기 구현
- [ ] 차트 시각화 (Chart.js)
- [ ] 상환 스케줄 테이블

### Phase 4: 최적화
- [ ] 모바일 반응형 개선
- [ ] 입력 검증 및 에러 처리
- [ ] 로딩 상태 UI

---

## 사용 예시

### 포스트에서 활용

```markdown
---
title: "대출 갈아타기, 얼마나 이득일까?"
slug: "loan-refinancing-calculator"
tags: ["실전", "계산기"]
---

# 대출 갈아타기, 얼마나 이득일까?

## 🧮 직접 계산해보세요

현재 대출 조건을 입력해보세요.

<LoanCalculator />

## 💡 결과 해석 방법

**월 상환액**이 줄었다면, 매달 부담이 줄어든다는 의미예요.
하지만 **총 이자액**도 함께 확인해야 해요!

...
```

---

## 주의사항

### 1. 면책 조항 필수

모든 계산기에 다음 문구를 표시하세요:

```tsx
<Callout type="info" title="📌 계산기 사용 안내">
이 계산기는 참고용으로 제공됩니다. 실제 금융사의 우대금리, 수수료, 세금 등에 따라 결과가 달라질 수 있어요. 정확한 금액은 해당 금융사에 직접 확인하세요.
</Callout>
```

### 2. 숫자 포맷팅

한국 원화 표시 시 천 단위 구분:

```tsx
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.round(value)) + '원';
}

function formatPercent(value: number): string {
  return value.toFixed(2) + '%';
}
```

### 3. 성능 최적화

계산 로직은 `useMemo`로 최적화:

```tsx
const result = useMemo(() => {
  return calculateLoan(loanAmount, interestRate, loanPeriod, repaymentType);
}, [loanAmount, interestRate, loanPeriod, repaymentType]);
```

---

## 참고 자료

- [토스 대출 이자 계산기](https://toss.im/tossfeed/calculator/loan)
- [복리 계산 공식](https://ko.wikipedia.org/wiki/복리)
- [예금자보호법](https://www.kdic.or.kr)

---

**작성일**: 2026-01-11
**다음 단계**: Phase 1 구현 시작
