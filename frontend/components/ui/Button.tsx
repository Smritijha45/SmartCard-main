import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'dark' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight select-none transition-all duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]';
    
    const sizeStyles = {
      sm: 'h-9 px-3.5 text-xs',
      md: 'h-11 px-5 text-sm',
      lg: 'h-13 px-7 text-base font-extrabold',
    };

    const variants = {
      primary: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]',
      secondary: 'bg-white text-gray-950 hover:bg-gray-100',
      accent: 'bg-[#06B6D4] text-gray-950 hover:bg-[#22D3EE]',
      outline: 'bg-transparent text-gray-100 hover:bg-white/10 border-slate-600 shadow-[3px_3px_0px_#000000]',
      dark: 'bg-[#090D16] text-white hover:bg-[#111827] border-black shadow-[3px_3px_0px_#2563EB]',
      ghost: 'bg-transparent border-transparent shadow-none hover:bg-white/10 text-gray-300 hover:text-white',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
