'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import ExamTimer from '@/components/exam/exam-timer';
import { useExamAccess } from '@/hooks/useExamAccess';
import { ExamAccessForm } from '@/components/exam/exam-access-form';
import { ExamMetadata } from '@/components/exam/exam-metadata';
import { examService } from '@/services/examService';
import { Question } from '@/types/exam';
import { isExamActive, getExamDuration } from '@/lib/examUtils';

export default function ExamPage() {
  const { examId } = useParams() as { examId: string };
  const router = useRouter();
  const { toast } = useToast();
  const { exam, loading, hasAccess, setHasAccess, examIsActive } = useExamAccess(examId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showAccessKeyDialog, setShowAccessKeyDialog] = useState<boolean>(false);

  // Handle answer updates
  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Handle exam submission
  const handleSubmit = async () => {
    if (!examId) return;

    setSubmitting(true);
    try {
      // Replace with actual API call when ready
      // await examService.submitExam(examId, answers);
      console.log('Submitting answers:', answers);

      toast({
        title: 'Exam Submitted',
        description: 'Your exam has been submitted successfully.',
      });

      // Redirect to results page after submission
      router.push(`/exams/${examId}/results`);
    } catch (error) {
      console.error('Failed to submit exam:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit your answers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleTimeUp = () => {
    toast({
      title: 'Time Up!',
      description: 'Your exam time has expired. Your answers have been automatically submitted.',
      variant: 'destructive',
    });
    handleSubmit();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <motion.div
          className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="mt-4 text-gray-600">Loading exam...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[50vh] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-2">Exam Not Found</h2>
        <p className="mb-4 text-gray-600">We couldn't find the exam you're looking for.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </motion.div>
    );
  }

  if (!examIsActive) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[50vh] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-2">Exam Not Active</h2>
        <p className="mb-4 text-gray-600">This exam is not currently available for taking.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </motion.div>
    );
  }

  // If the user hasn't accessed the exam yet, render exam preview instead of the actual exam
  if (!hasAccess) {
    return (
      <motion.div
        className="flex flex-col min-h-screen max-w-[800px] mx-auto p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">{exam.title}</h1>
          <p className="mb-6 text-gray-600">{exam.description}</p>

          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">Time Limit:</span>
              <span>{getExamDuration(exam)} minutes</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">Questions:</span>
              <span>{exam.questions?.length || 0}</span>
            </div>
            <ExamMetadata exam={exam} className="pt-2" />
          </div>

          <ExamAccessForm examId={examId as string} onSuccess={() => setHasAccess(true)} />
        </Card>
      </motion.div>
    );
  }

  // Get current question or fallback to first question
  const currentQuestion = exam?.questions?.[currentQuestionIndex] || null;

  // If we don't have questions, show an error
  if (!exam?.questions || exam.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">No Questions Available</h1>
          <p className="text-gray-600 text-center mb-6">
            This exam doesn't contain any questions yet.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col min-h-screen max-w-[1200px] mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 md:flex-row flex-col">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-1 text-gray-900">{exam.title}</h1>
          <p className="text-sm text-gray-600">{exam.description}</p>
        </motion.div>
        <ExamTimer timeLimit={getExamDuration(exam)} onTimeUp={handleTimeUp} />
      </header>

      <div className="flex flex-col md:flex-row flex-1 gap-8">
        <motion.aside
          className="md:sticky md:top-6 md:w-48 bg-gray-50 rounded-lg p-6 md:h-fit self-start w-full"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-base font-semibold mb-4">Questions</h2>
          <div className="grid grid-cols-4 gap-2">
            {exam?.questions?.map((question, index) => (
              <motion.button
                key={question.id}
                className={`aspect-square rounded p-2 border font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : answers[question.id]
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
                onClick={() => navigateToQuestion(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {index + 1}
              </motion.button>
            )) || (
              <div className="col-span-4 p-2 text-center text-gray-500">No questions available</div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center mb-2 text-xs">
              <div className="w-3 h-3 rounded bg-blue-500 mr-2"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center mb-2 text-xs">
              <div className="w-3 h-3 rounded bg-green-500 mr-2"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center mb-2 text-xs">
              <div className="w-3 h-3 rounded border border-gray-200 bg-white mr-2"></div>
              <span>Unanswered</span>
            </div>
          </div>
        </motion.aside>

        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {currentQuestion && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold">
                    Question {currentQuestionIndex + 1} of {exam?.questions?.length || 0}
                  </h2>

                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <div className="prose max-w-none mb-6">
                      <p>{currentQuestion.description}</p>
                    </div>

                    <div className="mt-4">
                      {currentQuestion.type === 'multiple-choice' && (
                        <div className="space-y-4">
                          {currentQuestion.options?.map(option => (
                            <motion.label
                              key={option.id}
                              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                answers[currentQuestion.id] === option.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <input
                                type="radio"
                                name={currentQuestion.id}
                                value={option.id}
                                checked={answers[currentQuestion.id] === option.id}
                                onChange={() => handleAnswer(currentQuestion.id, option.id)}
                                className="mr-4"
                              />
                              <span>{option.text}</span>
                            </motion.label>
                          )) || <p>No options available for this question.</p>}
                        </div>
                      )}

                      {currentQuestion.type === 'true-false' && (
                        <div className="space-y-4">
                          {currentQuestion.options?.map(option => (
                            <motion.label
                              key={option.id}
                              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                answers[currentQuestion.id] === option.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <input
                                type="radio"
                                name={currentQuestion.id}
                                value={option.id}
                                checked={answers[currentQuestion.id] === option.id}
                                onChange={() => handleAnswer(currentQuestion.id, option.id)}
                                className="mr-4"
                              />
                              <span>{option.text}</span>
                            </motion.label>
                          )) || <p>No options available for this question.</p>}
                        </div>
                      )}

                      {currentQuestion.type === 'short-answer' && (
                        <motion.textarea
                          className="w-full p-4 border border-gray-200 rounded-lg resize-y font-inherit focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          rows={5}
                          placeholder="Type your answer here..."
                          value={(answers[currentQuestion.id] as string) || ''}
                          onChange={e => handleAnswer(currentQuestion.id, e.target.value)}
                          initial={{ scale: 0.98 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}

                      {currentQuestion.type === 'essay' && (
                        <div className="space-y-2">
                          <motion.textarea
                            className="w-full border rounded-lg p-3 min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Write your essay answer here..."
                            value={answers[currentQuestion.id] || ''}
                            onChange={e => handleAnswer(currentQuestion.id, e.target.value)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                          <div className="text-xs text-gray-500 flex justify-between">
                            <span>Use the space above to write your answer</span>
                            <span>{answers[currentQuestion.id]?.length || 0} characters</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => navigateToQuestion(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="transition-all"
              >
                Previous
              </Button>
            </motion.div>

            {currentQuestionIndex < exam.questions.length - 1 ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => navigateToQuestion(currentQuestionIndex + 1)}>Next</Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={submitting ? { scale: [1, 0.95, 1] } : {}}
                transition={submitting ? { repeat: Infinity, repeatDelay: 0.5 } : {}}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {submitting ? 'Submitting...' : 'Submit Exam'}
                </Button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </motion.div>
  );
}
