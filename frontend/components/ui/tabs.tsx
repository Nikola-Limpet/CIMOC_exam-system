'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: 'default' | 'outline' | 'underline' | 'pill' | 'math' | 'dashboard';
    align?: 'start' | 'center' | 'end';
  }
>(({ className, variant = 'default', align = 'start', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center rounded-lg p-1',
      align === 'center' && 'justify-center',
      align === 'end' && 'justify-end',
      align === 'start' && 'justify-start',
      variant === 'default' && 'bg-muted/80 backdrop-blur-sm',
      variant === 'outline' && 'border border-border',
      variant === 'underline' && 'border-b border-border bg-transparent',
      variant === 'pill' && 'bg-transparent gap-2',
      variant === 'math' && 'bg-gradient-to-r from-muted via-muted/90 to-muted relative',
      variant === 'dashboard' &&
        'bg-card/40 border border-border/50 shadow-sm backdrop-blur-sm gap-2',
      className
    )}
    {...props}
  >
    {variant === 'math' && (
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground/30 rotate-12">
        ∑∫π
      </div>
    )}
    {variant === 'dashboard' && (
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 text-xs font-mono text-primary/20 rotate-6">
        ∑∫
      </div>
    )}
    {props.children}
  </TabsPrimitive.List>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    showSymbol?: boolean;
  }
>(({ className, showSymbol, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-sm font-medium',
      'transition-all duration-200',
      'text-foreground/80 bg-background/40 backdrop-blur-sm',
      'data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-background/80 data-[state=active]:shadow-sm',
      'hover:bg-accent/10 rounded-md',
      'data-[state=inactive]:hover:bg-muted/40',
      'data-[state=active]:after:content-[""] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-1/2 data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:h-[3px] data-[state=active]:after:w-3/5 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-t-full',

      // Dashboard variant styling
      '[data-variant=dashboard]:rounded-md [data-variant=dashboard]:px-5 [data-variant=dashboard]:py-2',
      '[data-variant=dashboard]:transition-all [data-variant=dashboard]:duration-200',
      '[data-variant=dashboard]:data-[state=active]:bg-gradient-to-b [data-variant=dashboard]:data-[state=active]:from-primary/10 [data-variant=dashboard]:data-[state=active]:to-primary/5',
      '[data-variant=dashboard]:data-[state=active]:border-b-2 [data-variant=dashboard]:data-[state=active]:border-primary',
      '[data-variant=dashboard]:data-[state=active]:text-primary [data-variant=dashboard]:data-[state=inactive]:text-foreground/70',
      '[data-variant=dashboard]:hover:bg-muted/30 [data-variant=dashboard]:data-[state=inactive]:hover:text-foreground/90',
      '[data-variant=dashboard]:data-[state=active]:after:hidden',

      className
    )}
    {...props}
  >
    {props.children}
    {showSymbol && (
      <span className="ml-1.5 text-xs text-primary/80 font-mono data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 transition-opacity">
        {props.value === 'solutions' && '∑'}
        {props.value === 'questions' && '?'}
        {props.value === 'results' && '√'}
        {props.value === 'statistics' && '∫'}
        {props.value === 'settings' && '⚙'}
        {props.value === 'upcoming' && '→'}
        {props.value === 'recent' && '↺'}
      </span>
    )}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    animate?: boolean;
  }
>(({ className, animate = true, ...props }, ref) => {
  const AnimatedContent = animate ? motion.div : 'div';

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-4 rounded-md',
        'overflow-hidden',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      <AnimatedContent
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {props.children}
      </AnimatedContent>
    </TabsPrimitive.Content>
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
