'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExamTimerProps {
  timeLimit: number; // in minutes
  onTimeUp: () => void;
}

export default function ExamTimer({ timeLimit, onTimeUp }: ExamTimerProps) {
  // Convert minutes to milliseconds
  const initialTime = timeLimit * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + initialTime;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        onTimeUp();
        return;
      }

      setTimeLeft(remaining);

      // Set warning states based on time remaining
      if (remaining < initialTime * 0.1) {
        setIsDanger(true);
      } else if (remaining < initialTime * 0.25) {
        setIsWarning(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime, onTimeUp]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(minutes)}:${pad(seconds)}`;
  };

  // Dynamically calculate the progress percentage
  const progressPercentage = (timeLeft / initialTime) * 100;

  // Tailwind class based on time remaining state
  const containerClass = isDanger
    ? 'bg-red-50 border-red-200'
    : isWarning
    ? 'bg-yellow-50 border-yellow-200'
    : 'bg-gray-50 border-gray-200';

  const textClass = isDanger ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-gray-700';

  const progressBarClass = isDanger ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-blue-500';

  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center justify-between p-3 px-4 rounded-lg border ${containerClass} relative overflow-hidden md:min-w-[180px]`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress bar in background */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${progressBarClass}`}
        style={{ width: `${progressPercentage}%` }}
        initial={{ width: '100%' }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.5 }}
      />

      <span className="text-xs text-gray-500 mb-1 md:mb-0 md:mr-3">Time Remaining:</span>

      <AnimatePresence mode="wait">
        <motion.span
          key={timeLeft}
          className={`text-lg md:text-xl font-bold font-mono ${textClass}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.2 }}
        >
          {formatTime(timeLeft)}
        </motion.span>
      </AnimatePresence>

      {/* Pulsing animation for danger state */}
      {isDanger && (
        <motion.div
          className="absolute inset-0 bg-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
