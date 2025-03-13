import React from 'react';
import { Question, Option, QuestionType, ExamAnswer } from '@/types/exam';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface QuestionViewProps {
  question: Question;
  answer: ExamAnswer | undefined;
  onChange: (answer: ExamAnswer) => void;
  showHints?: boolean;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  answer,
  onChange,
  showHints = false,
}) => {
  const handleSingleChoiceChange = (optionId: string) => {
    onChange({
      questionId: question.id,
      answer: optionId,
      type: question.type as QuestionType,
    });
  };

  const handleMultiChoiceChange = (optionId: string, checked: boolean) => {
    // Get current selections (or empty array if none)
    const currentSelections = (answer?.answer || []) as string[];

    let newSelections: string[];
    if (checked) {
      // Add to selections if checked
      newSelections = [...currentSelections, optionId];
    } else {
      // Remove from selections if unchecked
      newSelections = currentSelections.filter(id => id !== optionId);
    }

    onChange({
      questionId: question.id,
      answer: newSelections,
      type: question.type as QuestionType,
    });
  };

  const handleTextChange = (text: string) => {
    onChange({
      questionId: question.id,
      answer: text,
      type: question.type as QuestionType,
    });
  };

  const isOptionSelected = (optionId: string): boolean => {
    if (!answer) return false;

    if (question.type === 'multiple_choice') {
      return (answer.answer as string[]).includes(optionId);
    } else {
      return answer.answer === optionId;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{question.text}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
            </Badge>
            <Badge className="bg-accent/30 text-accent-foreground">
              {question.type === 'multiple_choice' && 'Multiple Choice'}
              {question.type === 'single_choice' && 'Single Choice'}
              {question.type === 'text' && 'Text Answer'}
            </Badge>
          </div>
        </div>

        {/* Display question image if available */}
        {question.image && (
          <div className="my-4 rounded-lg overflow-hidden border border-border">
            <img
              src={question.image}
              alt="Question image"
              className="max-h-[300px] w-auto object-contain mx-auto"
            />
          </div>
        )}

        {/* Hint for multiple choice */}
        {showHints && question.type === 'multiple_choice' && (
          <p className="text-sm text-muted-foreground italic">
            Select all correct answers that apply.
          </p>
        )}

        {/* Render question based on type */}
        <div className="mt-4">
          {question.type === 'text' ? (
            <textarea
              className="w-full min-h-[180px] p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Type your answer here..."
              value={(answer?.answer as string) || ''}
              onChange={e => handleTextChange(e.target.value)}
              spellCheck={false}
            />
          ) : question.type === 'multiple_choice' ? (
            <div className="space-y-2">
              {question.options?.map(option => (
                <label
                  key={option.id}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    isOptionSelected(option.id)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-accent/10'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-3 h-4 w-4"
                    checked={isOptionSelected(option.id)}
                    onChange={e => handleMultiChoiceChange(option.id, e.target.checked)}
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {question.options?.map(option => (
                <label
                  key={option.id}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    isOptionSelected(option.id)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-accent/10'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    className="mr-3 h-4 w-4"
                    checked={isOptionSelected(option.id)}
                    onChange={() => handleSingleChoiceChange(option.id)}
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
