import React from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border-2 border-black bg-[#0d1322] px-4 py-2 text-sm text-gray-100 font-medium placeholder:text-gray-500 shadow-[2px_2px_0px_#000000] focus:outline-none focus:border-blue-500 focus:shadow-[3px_3px_0px_#2563EB] transition-all disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
