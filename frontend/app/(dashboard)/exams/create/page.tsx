'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { examService } from '@/services/examService';

// Define Zod schemas for frontend validation
const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1, "Option text can't be empty"),
});

const questionSchema = z.object({
  description: z.string().min(1, "Question description can't be empty"),
  imageUrl: z.string().optional(),
  options: z.array(optionSchema).min(2, 'At least 2 options are required'),
  correctOption: z.string().min(1, 'You must select a correct option'),
});

const examSchema = z.object({
  title: z.string().min(1, "Exam title can't be empty"),
  description: z.string().optional(),
  duration: z.number().positive('Duration must be positive').optional(),
  availableFrom: z.string().optional(),
  availableTo: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

// Define interfaces for the option and question structures
interface Option {
  id: string;
  text: string;
}

interface Question {
  description: string;
  imageUrl?: string;
  options: Option[];
  correctOption: string;
}

// Define the exam interface
interface ExamFormData {
  title: string;
  description: string;
  duration: number;
  availableFrom: string;
  availableTo: string;
  status: 'draft' | 'published' | 'archived';
  questions: Question[];
}

export default function CreateExamPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [exam, setExam] = useState<ExamFormData>({
    title: '',
    description: '',
    duration: 60, // Default 60 minutes
    availableFrom: '',
    availableTo: '',
    status: 'draft',
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    description: '',
    imageUrl: '',
    options: [
      { id: uuidv4(), text: '' },
      { id: uuidv4(), text: '' },
    ],
    correctOption: '',
  });

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { id: uuidv4(), text: '' }],
    });
  };

  const removeOption = (id: string) => {
    if (currentQuestion.options.length <= 2) {
      alert('A question must have at least 2 options');
      return;
    }

    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter(option => option.id !== id),
      correctOption: currentQuestion.correctOption === id ? '' : currentQuestion.correctOption,
    });
  };

  const handleOptionChange = (id: string, value: string): void => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map(option =>
        option.id === id ? { ...option, text: value } : option
      ),
    });
  };

  const addQuestion = () => {
    // Validate the current question with Zod
    const result = questionSchema.safeParse(currentQuestion);

    if (!result.success) {
      // Format and display errors
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        formattedErrors[issue.path.join('.')] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    // Clear errors if validation passed
    setErrors({});

    // Add the question to the exam
    setExam({
      ...exam,
      questions: [...exam.questions, { ...currentQuestion }],
    });

    // Reset the current question
    setCurrentQuestion({
      description: '',
      imageUrl: '',
      options: [
        { id: uuidv4(), text: '' },
        { id: uuidv4(), text: '' },
      ],
      correctOption: '',
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions.splice(index, 1);
    setExam({ ...exam, questions: updatedQuestions });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate with Zod
    const result = examSchema.safeParse(exam);

    if (!result.success) {
      // Format and display errors
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        formattedErrors[issue.path.join('.')] = issue.message;
      });
      setErrors(formattedErrors);

      // Display the first error in an alert for visibility
      alert(result.error.issues[0].message);
      return;
    }

    // Clear errors if validation passed
    setErrors({});

    try {
      setIsSubmitting(true);

      // Use examService instead of direct fetch
      const result = await examService.createExam(exam);
      router.push(`/exams/${result.id}`);
    } catch (error: any) {
      console.error('Error creating exam:', error);

      // Handle validation errors from the server
      if (error.response?.status === 400) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          setErrors(validationErrors);
          alert('Please fix the validation errors');
        } else {
          alert(error.response.data?.message || 'Failed to create exam. Please try again.');
        }
      } else {
        alert('Failed to create exam. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to display field errors
  const getErrorMessage = (field: string) => {
    return errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Exam</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Exam Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Exam Details</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Title*</label>
              <input
                type="text"
                value={exam.title}
                onChange={e => setExam({ ...exam, title: e.target.value })}
                className={`w-full p-2 border rounded ${errors['title'] ? 'border-red-500' : ''}`}
                required
              />
              {getErrorMessage('title')}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={exam.duration}
                onChange={e => setExam({ ...exam, duration: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={exam.description}
              onChange={e => setExam({ ...exam, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={exam.status}
                onChange={e =>
                  setExam({ ...exam, status: e.target.value as 'draft' | 'published' | 'archived' })
                }
                className="w-full p-2 border rounded"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Available From</label>
              <input
                type="datetime-local"
                value={exam.availableFrom}
                onChange={e => setExam({ ...exam, availableFrom: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Available To</label>
              <input
                type="datetime-local"
                value={exam.availableTo}
                onChange={e => setExam({ ...exam, availableTo: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>

          {exam.questions.length > 0 ? (
            <div className="space-y-4 mb-6">
              {exam.questions.map((question, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="mt-2">{question.description}</p>
                  {question.imageUrl && (
                    <p className="text-sm text-gray-500">Has image: {question.imageUrl}</p>
                  )}
                  <div className="mt-2 space-y-1">
                    {question.options.map(option => (
                      <div key={option.id} className="flex items-center">
                        <span
                          className={`w-4 h-4 mr-2 inline-block rounded-full ${
                            option.id === question.correctOption ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No questions added yet.</p>
          )}

          {/* Add New Question Form */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Add New Question</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Question*</label>
                <textarea
                  value={currentQuestion.description}
                  onChange={e =>
                    setCurrentQuestion({ ...currentQuestion, description: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="Enter your question here"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  value={currentQuestion.imageUrl}
                  onChange={e =>
                    setCurrentQuestion({ ...currentQuestion, imageUrl: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Options*</label>
                <div className="space-y-2">
                  {currentQuestion.options.map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={currentQuestion.correctOption === option.id}
                        onChange={() =>
                          setCurrentQuestion({ ...currentQuestion, correctOption: option.id })
                        }
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={e => handleOptionChange(option.id, e.target.value)}
                        className="flex-1 p-2 border rounded"
                        placeholder="Option text"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(option.id)}
                        className="ml-2 text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addOption} className="mt-2 text-blue-600">
                  + Add Option
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Creating...' : 'Create Exam'}
          </button>
        </div>
      </form>
    </div>
  );
}
