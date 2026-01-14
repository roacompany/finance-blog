'use client';

import { useState, useMemo } from 'react';

type RegionType = 'metro' | 'non-metro';
type RepaymentType = 'equal' | 'principal' | 'maturity';

export default function DsrCalculator() {
  // 기본 정보
  const [annualIncome, setAnnualIncome] = useState(80000000); // 연소득
  const [loanAmount, setLoanAmount] = useState(500000000); // 대출 금액
  const [interestRate, setInterestRate] = useState(3.5); // 연 이자율
  const [loanPeriod, setLoanPeriod] = useState(360); // 대출 기간 (개월)
  const [region, setRegion] = useState<RegionType>('metro'); // 지역
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equal');

  // LTV 계산용
  const [housePrice, setHousePrice] = useState(700000000); // 주택 가격

  const result = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = loanPeriod;

    // 1. 월 상환액 계산
    let monthlyPayment = 0;

    if (repaymentType === 'equal') {
      // 원리금균등
      monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    } else if (repaymentType === 'principal') {
      // 원금균등 (첫 달 기준)
      const principalPayment = principal / months;
      const interestPayment = principal * monthlyRate;
      monthlyPayment = principalPayment + interestPayment;
    } else {
      // 만기일시
      monthlyPayment = principal * monthlyRate;
    }

    const annualPayment = monthlyPayment * 12;

    // 2. 기본 DSR 계산
    const basicDSR = (annualPayment / annualIncome) * 100;

    // 3. 스트레스 DSR 계산
    const stressRate = region === 'metro' ? 1.5 : 0.75; // 수도권 1.5%p, 비수도권 0.75%p
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
    const maxAnnualPayment = annualIncome * 0.4; // DSR 40%
    const maxMonthlyPayment = maxAnnualPayment / 12;

    // 역산으로 대출 한도 계산 (스트레스 DSR 기준)
    let maxLoanAmount = 0;

    if (repaymentType === 'equal') {
      maxLoanAmount =
        (maxMonthlyPayment * (Math.pow(1 + stressMonthlyRate, months) - 1)) /
        (stressMonthlyRate * Math.pow(1 + stressMonthlyRate, months));
    } else if (repaymentType === 'principal') {
      // 원금균등은 첫 달 기준으로 계산
      // maxMonthlyPayment = principal/months + principal * stressMonthlyRate
      // 정리하면: maxLoanAmount = maxMonthlyPayment / (1/months + stressMonthlyRate)
      maxLoanAmount = maxMonthlyPayment / (1/months + stressMonthlyRate);
    } else {
      // 만기일시
      maxLoanAmount = maxMonthlyPayment / stressMonthlyRate;
    }

    // 5. LTV 계산
    const ltv = (loanAmount / housePrice) * 100;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      annualPayment: Math.round(annualPayment),
      basicDSR: Math.round(basicDSR * 10) / 10,
      stressDSR: Math.round(stressDSR * 10) / 10,
      maxLoanAmount: Math.round(maxLoanAmount / 1000000) * 1000000, // 백만원 단위
      ltv: Math.round(ltv * 10) / 10,
    };
  }, [annualIncome, loanAmount, interestRate, loanPeriod, region, repaymentType, housePrice]);

  return (
    <div style={{
      margin: '32px 0',
      padding: '32px',
      backgroundColor: '#F9FAFB',
      borderRadius: '16px',
      border: '1px solid #E5E8EB',
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#191F28',
        marginBottom: '24px',
      }}>
        🧮 DSR/LTV 계산기
      </h3>

      {/* 입력 영역 */}
      <div style={{ marginBottom: '32px' }}>
        {/* 연소득 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#191F28',
          }}>
            연소득
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              step="10000000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                paddingRight: '50px',
                fontSize: '16px',
                border: '1px solid #E5E8EB',
                borderRadius: '12px',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8B95A1',
              fontSize: '14px',
            }}>
              원
            </span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#8B95A1' }}>
            {(annualIncome / 10000).toLocaleString()}만원 = {(annualIncome / 100000000).toFixed(1)}억원
          </div>
        </div>

        {/* 대출 금액 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#191F28',
          }}>
            대출 금액
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              step="10000000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                paddingRight: '50px',
                fontSize: '16px',
                border: '1px solid #E5E8EB',
                borderRadius: '12px',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8B95A1',
              fontSize: '14px',
            }}>
              원
            </span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#8B95A1' }}>
            {(loanAmount / 100000000).toFixed(1)}억원
          </div>
        </div>

        {/* 주택 가격 (LTV 계산용) */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#191F28',
          }}>
            주택 가격 (LTV 계산용)
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              step="10000000"
              value={housePrice}
              onChange={(e) => setHousePrice(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                paddingRight: '50px',
                fontSize: '16px',
                border: '1px solid #E5E8EB',
                borderRadius: '12px',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8B95A1',
              fontSize: '14px',
            }}>
              원
            </span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#8B95A1' }}>
            {(housePrice / 100000000).toFixed(1)}억원
          </div>
        </div>

        {/* 대출 금리 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#191F28',
          }}>
            연 이자율
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                paddingRight: '40px',
                fontSize: '16px',
                border: '1px solid #E5E8EB',
                borderRadius: '12px',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8B95A1',
              fontSize: '14px',
            }}>
              %
            </span>
          </div>
        </div>

        {/* 대출 기간 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#191F28',
          }}>
            대출 기간
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              step="12"
              min="12"
              max="480"
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                paddingRight: '50px',
                fontSize: '16px',
                border: '1px solid #E5E8EB',
                borderRadius: '12px',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8B95A1',
              fontSize: '14px',
            }}>
              개월
            </span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#8B95A1' }}>
            {Math.round(loanPeriod / 12)}년
          </div>
        </div>

        {/* 상환 방식 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#191F28',
          }}>
            상환 방식
          </label>
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '4px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
          }}>
            <button
              onClick={() => setRepaymentType('equal')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: repaymentType === 'equal' ? '#3182F6' : 'transparent',
                color: repaymentType === 'equal' ? '#FFFFFF' : '#8B95A1',
                transition: 'all 0.2s ease',
              }}
            >
              원리금균등
            </button>
            <button
              onClick={() => setRepaymentType('principal')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: repaymentType === 'principal' ? '#3182F6' : 'transparent',
                color: repaymentType === 'principal' ? '#FFFFFF' : '#8B95A1',
                transition: 'all 0.2s ease',
              }}
            >
              원금균등
            </button>
            <button
              onClick={() => setRepaymentType('maturity')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: repaymentType === 'maturity' ? '#3182F6' : 'transparent',
                color: repaymentType === 'maturity' ? '#FFFFFF' : '#8B95A1',
                transition: 'all 0.2s ease',
              }}
            >
              만기일시
            </button>
          </div>
        </div>

        {/* 지역 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#191F28',
          }}>
            지역 (스트레스 DSR 기준)
          </label>
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '4px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
          }}>
            <button
              onClick={() => setRegion('metro')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: region === 'metro' ? '#3182F6' : 'transparent',
                color: region === 'metro' ? '#FFFFFF' : '#8B95A1',
                transition: 'all 0.2s ease',
              }}
            >
              수도권 (+1.5%p)
            </button>
            <button
              onClick={() => setRegion('non-metro')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: region === 'non-metro' ? '#3182F6' : 'transparent',
                color: region === 'non-metro' ? '#FFFFFF' : '#8B95A1',
                transition: 'all 0.2s ease',
              }}
            >
              비수도권 (+0.75%p)
            </button>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7684', lineHeight: 1.5 }}>
            💡 비수도권은 2026년 6월까지 0.75%p 적용 (이후 1.5%p)
          </div>
        </div>
      </div>

      {/* 결과 영역 */}
      <div style={{
        padding: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E8EB',
      }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#191F28',
          marginBottom: '20px',
        }}>
          📊 계산 결과
        </h4>

        {/* 월 상환액 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '8px' }}>
            월 상환액
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#191F28' }}>
            {result.monthlyPayment.toLocaleString()}원
          </div>
        </div>

        {/* DSR 결과 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '20px',
        }}>
          <div>
            <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '8px' }}>
              기본 DSR
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 600,
              color: result.basicDSR <= 40 ? '#00C853' : '#EF4444',
            }}>
              {result.basicDSR.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '8px' }}>
              스트레스 DSR
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 600,
              color: result.stressDSR <= 40 ? '#00C853' : '#EF4444',
            }}>
              {result.stressDSR.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* LTV 결과 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '8px' }}>
            LTV (주택담보인정비율)
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: 600,
            color: result.ltv <= 70 ? '#00C853' : '#EF4444',
          }}>
            {result.ltv.toFixed(1)}%
          </div>
        </div>

        {/* 대출 한도 */}
        <div style={{
          padding: '16px',
          backgroundColor: '#EFF6FF',
          borderRadius: '8px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '13px', color: '#3182F6', marginBottom: '8px', fontWeight: 600 }}>
            💰 DSR 40% 기준 최대 대출 한도
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#3182F6' }}>
            {(result.maxLoanAmount / 100000000).toFixed(1)}억원
          </div>
          <div style={{ fontSize: '12px', color: '#6B7684', marginTop: '4px' }}>
            ({result.maxLoanAmount.toLocaleString()}원)
          </div>
        </div>

        {/* 판정 메시지 */}
        {result.stressDSR > 40 && (
          <div style={{
            padding: '12px',
            backgroundColor: '#FEF2F2',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#EF4444',
            lineHeight: 1.6,
          }}>
            ⚠️ 스트레스 DSR이 40%를 초과했어요. 대출 심사에서 제한받을 수 있어요.
          </div>
        )}

        {result.ltv > 70 && (
          <div style={{
            padding: '12px',
            backgroundColor: '#FEF2F2',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#EF4444',
            lineHeight: 1.6,
            marginTop: '8px',
          }}>
            ⚠️ LTV가 70%를 초과했어요. 규제지역에서는 대출이 제한될 수 있어요.
          </div>
        )}

        {result.stressDSR <= 40 && result.ltv <= 70 && (
          <div style={{
            padding: '12px',
            backgroundColor: '#F0FDF4',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#00C853',
            lineHeight: 1.6,
          }}>
            ✅ DSR과 LTV가 모두 기준 이내예요. 대출 가능성이 높아요.
          </div>
        )}
      </div>

      {/* 안내 메시지 */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#EFF6FF',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#4E5968',
        lineHeight: 1.6,
      }}>
        💡 이 계산기는 참고용이에요. 실제 대출 한도는 금융사별 심사 기준, 신용등급, 담보 평가액 등에 따라 달라질 수 있어요.
        정확한 상담은 금융 전문가와 하시기 바라요.
      </div>
    </div>
  );
}
