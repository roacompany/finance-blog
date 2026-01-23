'use client';

import { useState, useMemo } from 'react';
import { Slider, Button } from '@/components/ui';

type RepaymentType = 'equal' | 'principal' | 'maturity';

/**
 * LoanCalculator Component
 * 토스 스타일의 대출 이자 계산기
 * 슬라이더 + 시각화 추가
 */
export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(100000000); // 1억원
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanPeriod, setLoanPeriod] = useState(360); // 30년
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equal');

  const result = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = loanPeriod;

    if (repaymentType === 'equal') {
      // 원리금균등 상환
      const monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = monthlyPayment * months;
      const totalInterest = totalPayment - principal;

      return {
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
      };
    } else if (repaymentType === 'principal') {
      // 원금균등 상환
      const principalPayment = principal / months;
      let totalInterest = 0;
      for (let i = 0; i < months; i++) {
        const remainingPrincipal = principal - principalPayment * i;
        totalInterest += remainingPrincipal * monthlyRate;
      }
      const firstMonthPayment = principalPayment + principal * monthlyRate;
      const totalPayment = principal + totalInterest;

      return {
        monthlyPayment: Math.round(firstMonthPayment),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
      };
    } else {
      // 만기일시 상환
      const monthlyInterest = principal * monthlyRate;
      const totalInterest = monthlyInterest * months;
      const totalPayment = principal + totalInterest;

      return {
        monthlyPayment: Math.round(monthlyInterest),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
      };
    }
  }, [loanAmount, interestRate, loanPeriod, repaymentType]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  // 원금/이자 비율 계산
  const principalRatio = ((loanAmount / result.totalPayment) * 100).toFixed(1);
  const interestRatio = ((result.totalInterest / result.totalPayment) * 100).toFixed(1);

  return (
    <div className="my-8 p-6 md:p-8 bg-gray-50 rounded-2xl border border-gray-200">
      <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
        <span>🧮</span>
        <span>대출 이자 계산기</span>
      </h3>

      {/* 입력 영역 */}
      <div className="space-y-6 mb-8">
        {/* 대출 금액 슬라이더 */}
        <Slider
          label="💰 대출 금액"
          min={10000000}
          max={1000000000}
          step={10000000}
          value={loanAmount}
          onChange={setLoanAmount}
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
      </div>

      {/* 결과 표시 */}
      <div className="p-6 bg-white rounded-xl border border-gray-200">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">
            {repaymentType === 'principal' ? '첫 달 상환액' : '월 상환액'}
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {formatCurrency(result.monthlyPayment)}
          </div>

          {/* 원금/이자 비율 시각화 바 */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-700">총 상환액 구성</div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-600 transition-all duration-300"
                style={{ width: `${principalRatio}%` }}
              />
              <div
                className="bg-red-500 transition-all duration-300"
                style={{ width: `${interestRatio}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                <span className="w-3 h-3 bg-blue-600 rounded-full" />
                원금 {principalRatio}%
              </span>
              <span className="flex items-center gap-1.5 text-red-500 font-medium">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                이자 {interestRatio}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <div className="text-xs text-gray-500 mb-1">총 상환액</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(result.totalPayment)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">총 이자</div>
            <div className="text-lg font-semibold text-red-600">
              {formatCurrency(result.totalInterest)}
            </div>
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700 leading-relaxed">
        💡 이 계산기는 참고용이에요. 실제 금융사의 우대금리, 수수료 등에 따라 결과가 달라질 수
        있어요.
      </div>
    </div>
  );
}
