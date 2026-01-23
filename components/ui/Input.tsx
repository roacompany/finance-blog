import { cn, getInputClasses } from '@/lib/design-system';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'error' | 'success' | 'disabled';
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Input Component
 * 토스 스타일의 입력 필드 컴포넌트
 */
export function Input({
  size = 'md',
  state = 'default',
  label,
  error,
  helperText,
  className,
  disabled,
  ...props
}: InputProps) {
  const inputState = disabled ? 'disabled' : error ? 'error' : state;
  const inputClasses = cn(getInputClasses(size, inputState), className);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}

      <input
        className={inputClasses}
        disabled={disabled}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {!error && helperText && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// Slider Component (계산기용)
interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  className,
}: SliderProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-gray-900">{label}</label>
          <span className="text-sm font-bold text-blue-600">
            {formatValue ? formatValue(value) : value}
          </span>
        </div>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
          '[&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-blue-700',
          '[&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:transition-transform',
          '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-blue-600',
          '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0',
          '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:bg-blue-700',
          className
        )}
      />

      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
}
