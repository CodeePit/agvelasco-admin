import * as React from 'react';
import MaskedInput, { type Mask } from 'react-text-mask';
import { cn } from 'utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          error && '!border-red-500',
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

const InputMask = React.forwardRef<
  HTMLInputElement,
  InputProps & { mask: Mask; showMask?: boolean }
>(({ mask, error, showMask, ...props }, ref) => {
  return (
    <MaskedInput
      mask={mask}
      guide={showMask}
      ref={ref as (instance: MaskedInput | null) => void}
      {...props}
      render={(innerRef, inputProps) => (
        <Input
          ref={innerRef as (instance: HTMLInputElement | null) => void}
          error={error}
          {...inputProps}
        />
      )}
    />
  );
});
InputMask.displayName = 'InputMask';

export { Input, InputMask };
