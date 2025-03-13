'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

export type MathDecoration =
  | boolean
  | 'sigma'
  | 'integral'
  | 'infinity'
  | 'pi'
  | 'function'
  | 'coordinate'
  | 'euler'
  | 'probability'
  | 'set';

const getMathSymbols = (decoration: MathDecoration): string => {
  if (decoration === true) return '∑ ∫ ∞';
  if (decoration === 'sigma') return '∑';
  if (decoration === 'integral') return '∫';
  if (decoration === 'infinity') return '∞';
  if (decoration === 'pi') return 'π';
  if (decoration === 'function') return 'ƒ(x)';
  if (decoration === 'coordinate') return '(x,y)';
  if (decoration === 'euler') return 'e^iπ';
  if (decoration === 'probability') return 'P(A∩B)';
  if (decoration === 'set') return '{ x | x∈ℝ }';
  return '';
};

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  mathDecoration?: MathDecoration;
  variant?: 'default' | 'gradient' | 'dashed' | 'dotted' | 'double' | 'glow' | 'themed';
  decorationClassName?: string;
  animated?: boolean;
  withDots?: boolean;
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = 'horizontal',
      decorative = true,
      mathDecoration = false,
      variant = 'gradient',
      decorationClassName,
      animated = false,
      withDots = false,
      ...props
    },
    ref
  ) => (
    <div className={cn('relative', orientation === 'horizontal' ? 'py-2' : 'px-2')}>
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          'shrink-0',
          // Base styling by orientation
          orientation === 'horizontal' ? 'h-[1px] w-full my-2' : 'h-full w-[1px] mx-2',

          // Variants
          variant === 'default' && 'bg-border',
          variant === 'gradient' &&
            orientation === 'horizontal' &&
            'bg-gradient-to-r from-transparent via-border to-transparent',
          variant === 'gradient' &&
            orientation === 'vertical' &&
            'bg-gradient-to-b from-transparent via-border to-transparent',
          variant === 'themed' &&
            orientation === 'horizontal' &&
            'h-[2px] bg-gradient-to-r from-primary/30 via-primary to-primary/30',
          variant === 'themed' &&
            orientation === 'vertical' &&
            'w-[2px] bg-gradient-to-b from-primary/30 via-primary to-primary/30',
          variant === 'glow' &&
            orientation === 'horizontal' &&
            'h-[1px] bg-primary/50 shadow-[0_0_10px_1px_var(--primary)]',
          variant === 'glow' &&
            orientation === 'vertical' &&
            'w-[1px] bg-primary/50 shadow-[0_0_10px_1px_var(--primary)]',
          variant === 'dashed' && 'border-dashed border-t border-border border-b-0 h-0',
          variant === 'dotted' && 'border-dotted border-t border-border border-b-0 h-0',
          variant === 'double' && 'border-double border-t-2 border-b-2 h-[4px] border-border',

          // Animation
          animated &&
            orientation === 'horizontal' &&
            'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-1000 hover:after:w-full',

          className
        )}
        {...props}
      />

      {mathDecoration && orientation === 'horizontal' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={cn(
              'px-3 py-0.5 text-xs font-mono bg-background text-muted-foreground',
              variant === 'gradient' ? 'opacity-75' : 'opacity-90',
              variant === 'themed' &&
                'px-4 rounded-full border border-primary/20 text-primary shadow-sm',
              variant === 'glow' && 'px-4 text-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]',
              variant === 'default' && 'rounded-full border border-muted',
              variant === 'double' && 'px-4',
              decorationClassName
            )}
          >
            {getMathSymbols(mathDecoration)}
          </span>
        </div>
      )}

      {withDots && orientation === 'horizontal' && (
        <>
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full',
              variant === 'themed' ? 'bg-primary' : 'bg-border',
              variant === 'glow' && 'shadow-[0_0_5px_rgba(var(--primary),0.6)]'
            )}
            style={{ left: '0px' }}
          />
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full',
              variant === 'themed' ? 'bg-primary' : 'bg-border',
              variant === 'glow' && 'shadow-[0_0_5px_rgba(var(--primary),0.6)]'
            )}
            style={{ right: '0px' }}
          />
        </>
      )}
    </div>
  )
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
