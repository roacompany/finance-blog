'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui';

type RegionType = 'metro' | 'non-metro';
type RepaymentType = 'equal' | 'principal' | 'maturity';

/**
 * DsrCalculator Component
 * 토스 스타일의 DSR/LTV 계산기
 * 슬라이더 + 시각화 추가
 */
export default function DsrCalculator() {
  const [annualIncome, setAnnualIncome] = useState(80000000);
  const [loanAmount, setLoanAmount] = useState(500000000);
  const [housePrice, setHousePrice] = useState(700000000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanPeriod, setLoanPeriod] = useState(360);
  const [region, setRegion] = useState<RegionType>('metro');
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equal');

  const result = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = loanPeriod;

    // 1. 월 상환액 계산
    let monthlyPayment = 0;

    if (repaymentType === 'equal') {
      monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    } else if (repaymentType === 'principal') {
      const principalPayment = principal / months;
      const interestPayment = principal * monthlyRate;
      monthlyPayment = principalPayment + interestPayment;
    } else {
      monthlyPayment = principal * monthlyRate;
    }

    const annualPayment = monthlyPayment * 12;

    // 2. 기본 DSR 계산
    const basicDSR = (annualPayment / annualIncome) * 100;

    // 3. 스트레스 DSR 계산
    const stressRate = region === 'metro' ? 1.5 : 0.75;
    const stressInterestRate = interestRate + stressRate;
    const stressMonthlyRate = stressInterestRate / 100 / 12;

    let stressMonthlyPayment = 0;

    if (repaymentType === 'equal') {
      stressMonthlyPayment =
        (principal * stressMonthlyRate * Math.pow(1 + stressMonthlyRate, months)) /
        (Math.pow(1 + stressMonthlyRate, months) - 1);
    } else if (repaymentType === 'principal') {
      const principalPayment = principal / months;
      const interestPayment = principal * stressMonthlyRate;
      stressMonthlyPayment = principalPayment + interestPayment;
    } else {
      stressMonthlyPayment = principal * stressMonthlyRate;
    }

    const stressAnnualPayment = stressMonthlyPayment * 12;
    const stressDSR = (stressAnnualPayment / annualIncome) * 100;

    // 4. DSR 40% 기준 대출 한도 계산
    const maxAnnualPayment = annualIncome * 0.4;
    const maxMonthlyPayment = maxAnnualPayment / 12;

    let maxLoanAmount = 0;

    if (repaymentType === 'equal') {
      maxLoanAmount =
        (maxMonthlyPayment * (Math.pow(1 + stressMonthlyRate, months) - 1)) /
        (stressMonthlyRate * Math.pow(1 + stressMonthlyRate, months));
    } else if (repaymentType === 'principal') {
      maxLoanAmount = maxMonthlyPayment / (1 / months + stressMonthlyRate);
    } else {
      maxLoanAmount = maxMonthlyPayment / stressMonthlyRate;
    }

    // 5. LTV 계산
    const ltv = (loanAmount / housePrice) * 100;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      annualPayment: Math.round(annualPayment),
      basicDSR: Math.round(basicDSR * 10) / 10,
      stressDSR: Math.round(stressDSR * 10) / 10,
      maxLoanAmount: Math.round(maxLoanAmount / 1000000) * 1000000,
      ltv: Math.round(ltv * 10) / 10,
    };
  }, [annualIncome, loanAmount, interestRate, loanPeriod, region, repaymentType, housePrice]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  return (
    <div className="my-8 p-6 md:p-8 bg-gray-50 rounded-2xl border border-gray-200">
      <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
        <span>🧮</span>
        <span>DSR/LTV 계산기</span>
      </h3>

      {/* 입력 영역 */}
      <div className="space-y-6 mb-8">
        {/* 연소득 슬라이더 */}
        <Slider
          label="💰 연소득"
          min={30000000}
          max={300000000}
          step={10000000}
          value={annualIncome}
          onChange={setAnnualIncome}
          formatValue={(v) => `${(v / 100000000).toFixed(1)}억원`}
        />

        {/* 대출 금액 슬라이더 */}
        <Slider
          label="💳 대출 금액"
          min={10000000}
          max={1000000000}
          step={10000000}
          value={loanAmount}
          onChange={setLoanAmount}
          formatValue={(v) => `${(v / 100000000).toFixed(1)}억원`}
        />

        {/* 주택 가격 슬라이더 */}
        <Slider
          label="🏠 주택 가격 (LTV 계산용)"
          min={50000000}
          max={2000000000}
          step={10000000}
          value={housePrice}
          onChange={setHousePrice}
          formatValue={(v) => `${(v / 100000000).toFixed(1)}억원`}
        />

        {/* 연 이자율 슬라이더 */}
        <Slider
          label="📊 연 이자율"
          min={0}
          max={20}
          step={0.1}
          value={interestRate}
          onChange={setInterestRate}
          formatValue={(v) => `${v}%`}
        />

        {/* 대출 기간 슬라이더 */}
        <Slider
          label="⏱️ 대출 기간"
          min={12}
          max={360}
          step={12}
          value={loanPeriod}
          onChange={setLoanPeriod}
          formatValue={(v) => `${v}개월 (${(v / 12).toFixed(0)}년)`}
        />

        {/* 상환 방식 선택 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            🔄 상환 방식
          </label>
          <div className="flex gap-2 p-1 bg-white rounded-xl">
            {[
              { value: 'equal' as RepaymentType, label: '원리금균등' },
              { value: 'principal' as RepaymentType, label: '원금균등' },
              { value: 'maturity' as RepaymentType, label: '만기일시' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setRepaymentType(option.value)}
                className={`
                  flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg
                  transition-all duration-200
                  ${
                    repaymentType === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 지역 선택 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            📍 지역 (스트레스 DSR 기준)
          </label>
          <div className="flex gap-2 p-1 bg-white rounded-xl">
            <button
              onClick={() => setRegion('metro')}
              className={`
                flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg
                transition-all duration-200
                ${
                  region === 'metro'
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              수도권 (+1.5%p)
            </button>
            <button
              onClick={() => setRegion('non-metro')}
              className={`
                flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg
                transition-all duration-200
                ${
                  region === 'non-metro'
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              비수도권 (+0.75%p)
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">
            💡 비수도권은 2026년 6월까지 0.75%p 적용 (이후 1.5%p)
          </p>
        </div>
      </div>

      {/* 결과 표시 */}
      <div className="p-6 bg-white rounded-xl border border-gray-200">
        <h4 className="text-base font-bold text-gray-900 mb-5">📊 계산 결과</h4>

        {/* 월 상환액 */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">월 상환액</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(result.monthlyPayment)}
          </div>
        </div>

        {/* DSR 결과 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-2">기본 DSR</div>
            <div
              className={`text-xl font-semibold ${
                result.basicDSR <= 40 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {result.basicDSR.toFixed(1)}%
            </div>
            {/* DSR 비율 바 */}
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  result.basicDSR <= 40 ? 'bg-green-600' : 'bg-red-600'
                }`}
                style={{ width: `${Math.min(result.basicDSR / 40 * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">스트레스 DSR</div>
            <div
              className={`text-xl font-semibold ${
                result.stressDSR <= 40 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {result.stressDSR.toFixed(1)}%
            </div>
            {/* DSR 비율 바 */}
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  result.stressDSR <= 40 ? 'bg-green-600' : 'bg-red-600'
                }`}
                style={{ width: `${Math.min(result.stressDSR / 40 * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* LTV 결과 */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">LTV (주택담보인정비율)</div>
          <div
            className={`text-xl font-semibold ${
              result.ltv <= 70 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {result.ltv.toFixed(1)}%
          </div>
          {/* LTV 비율 바 */}
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                result.ltv <= 70 ? 'bg-green-600' : 'bg-red-600'
              }`}
              style={{ width: `${Math.min(result.ltv / 70 * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 대출 한도 */}
        <div className="p-4 bg-blue-50 rounded-xl mb-4">
          <div className="text-sm text-blue-600 font-semibold mb-2">
            💰 DSR 40% 기준 최대 대출 한도
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {(result.maxLoanAmount / 100000000).toFixed(1)}억원
          </div>
          <div className="text-xs text-gray-600 mt-1">
            ({formatCurrency(result.maxLoanAmount)})
          </div>
        </div>

        {/* 판정 메시지 */}
        {result.stressDSR > 40 && (
          <div className="p-3 bg-red-50 rounded-lg text-sm text-red-600 leading-relaxed">
            ⚠️ 스트레스 DSR이 40%를 초과했어요. 대출 심사에서 제한받을 수 있어요.
          </div>
        )}

        {result.ltv > 70 && (
          <div className="p-3 bg-red-50 rounded-lg text-sm text-red-600 leading-relaxed mt-2">
            ⚠️ LTV가 70%를 초과했어요. 규제지역에서는 대출이 제한될 수 있어요.
          </div>
        )}

        {result.stressDSR <= 40 && result.ltv <= 70 && (
          <div className="p-3 bg-green-50 rounded-lg text-sm text-green-600 leading-relaxed">
            ✅ DSR과 LTV가 모두 기준 이내예요. 대출 가능성이 높아요.
          </div>
        )}
      </div>

      {/* 안내 문구 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700 leading-relaxed">
        💡 이 계산기는 참고용이에요. 실제 금융사의 우대금리, 기타 대출 등에 따라 결과가 달라질
        수 있어요.
      </div>
    </div>
  );
}
