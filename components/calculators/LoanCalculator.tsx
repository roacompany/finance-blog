'use client';

import { useState, useMemo } from 'react';

type RepaymentType = 'equal' | 'principal' | 'maturity';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(10000000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanPeriod, setLoanPeriod] = useState(12);
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
        const remainingPrincipal = principal - (principalPayment * i);
        totalInterest += remainingPrincipal * monthlyRate;
      }
      const firstMonthPayment = principalPayment + (principal * monthlyRate);
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
        🧮 대출 이자 계산기
      </h3>

      {/* 입력 필드 */}
      <div style={{ marginBottom: '32px' }}>
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
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            step={1000000}
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
            원
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
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
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            step={0.1}
            min={0}
            max={20}
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

      <div style={{ marginBottom: '32px' }}>
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
            value={loanPeriod}
            onChange={(e) => setLoanPeriod(Number(e.target.value))}
            step={1}
            min={1}
            max={360}
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
      </div>

      {/* 상환 방식 선택 */}
      <div style={{ marginBottom: '32px' }}>
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
          {[
            { value: 'equal' as RepaymentType, label: '원리금균등' },
            { value: 'principal' as RepaymentType, label: '원금균등' },
            { value: 'maturity' as RepaymentType, label: '만기일시' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setRepaymentType(option.value)}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: repaymentType === option.value ? '#3182F6' : 'transparent',
                color: repaymentType === option.value ? '#FFFFFF' : '#8B95A1',
                transition: 'all 0.2s ease',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 표시 */}
      <div style={{
        padding: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E8EB',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '13px',
            color: '#8B95A1',
            marginBottom: '8px',
          }}>
            {repaymentType === 'principal' ? '첫 달 상환액' : '월 상환액'}
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#3182F6',
          }}>
            {formatCurrency(result.monthlyPayment)}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}>
          <div>
            <div style={{
              fontSize: '13px',
              color: '#8B95A1',
              marginBottom: '8px',
            }}>
              총 상환액
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#191F28',
            }}>
              {formatCurrency(result.totalPayment)}
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '13px',
              color: '#8B95A1',
              marginBottom: '8px',
            }}>
              총 이자
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#EF4444',
            }}>
              {formatCurrency(result.totalInterest)}
            </div>
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#EFF6FF',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#4E5968',
        lineHeight: 1.6,
      }}>
        💡 이 계산기는 참고용이에요. 실제 금융사의 우대금리, 수수료 등에 따라 결과가 달라질 수 있어요.
      </div>
    </div>
  );
}
