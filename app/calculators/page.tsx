import type { Metadata } from 'next';
import LoanCalculator from '@/components/calculators/LoanCalculator';
import DsrCalculator from '@/components/calculators/DsrCalculator';
import { getContainerClass } from '@/lib/design-system';

export const metadata: Metadata = {
  title: '금융 계산기 | ROA Finance',
  description: '대출 이자 계산기, DSR/LTV 계산기 등 다양한 금융 계산기를 제공합니다.',
  keywords: ['대출 계산기', 'DSR 계산기', 'LTV 계산기', '금융 계산기', '이자 계산'],
};

/**
 * Calculators Page
 * 금융 계산기 모음 페이지
 */
export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 py-12 md:py-16">
        <div className={getContainerClass()}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            금융 계산기
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            대출 이자, DSR/LTV 등 금융 관련 계산을 간편하게 해보세요.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className={getContainerClass() + ' py-12 md:py-16'}>
        <div className="space-y-16">
          {/* Loan Calculator Section */}
          <section id="loan-calculator">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                대출 이자 계산기
              </h2>
              <p className="text-sm text-gray-600">
                대출 금액, 이자율, 상환 기간을 입력하여 월 상환액과 총 이자를 계산합니다.
              </p>
            </div>
            <LoanCalculator />
          </section>

          {/* DSR/LTV Calculator Section */}
          <section id="dsr-calculator">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                DSR/LTV 계산기
              </h2>
              <p className="text-sm text-gray-600">
                연소득, 대출 금액, 주택 가격을 입력하여 DSR과 LTV 비율을 확인합니다.
              </p>
            </div>
            <DsrCalculator />
          </section>
        </div>
      </main>
    </div>
  );
}
