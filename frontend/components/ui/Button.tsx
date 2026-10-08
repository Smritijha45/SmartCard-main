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
    const baseStyles = 'inline-flex items-center justify-center font-medium select-none transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:pointer-events-none disabled:opacity-50 cursor-pointer rounded-lg';
    
    const sizeStyles = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9.5 px-4 text-sm gap-2',
      lg: 'h-11 px-5.5 text-sm font-semibold gap-2.5',
    };

    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm active:bg-blue-800',
      secondary: 'bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs active:bg-slate-100 dark:active:bg-slate-700',
      accent: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs hover:shadow-sm active:bg-cyan-700',
      outline: 'bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 active:bg-slate-200 dark:active:bg-slate-750',
      dark: 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-850 dark:hover:bg-slate-700 border border-slate-800 dark:border-slate-700 shadow-xs',
      ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:shadow-sm active:bg-rose-800',
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
