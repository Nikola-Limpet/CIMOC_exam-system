'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const FormField = ({
  id,
  label,
  error,
  children,
  required = false,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
  hint?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="flex items-center">
      {label}
      {required && <span className="text-chart-2 ml-1">*</span>}
    </Label>

    {hint && <p className="text-xs text-muted-foreground -mt-1">{hint}</p>}

    {children}

    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-destructive text-sm mt-1 flex items-center"
        role="alert"
        aria-live="polite"
      >
        <span className="inline-block mr-1">⚠</span> {error}
      </motion.p>
    )}
  </div>
);
