'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';

type FormData = {
  topic: string;
  difficulty: string;
};

export default function QuizGeneratorPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/runQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: data.topic, difficulty: data.difficulty }),
      });

      const result = await response.json();

      if (!response.ok) {
        setOutput(`Error: ${result.error || 'Failed to generate quiz'}`);
        setIsLoading(false);
        return;
      }

      setOutput(result.result);
      setIsLoading(false);
    } catch (error) {
      setOutput(`Error: Network error. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Generator</h1>
        <p className="text-gray-600">Create custom quizzes for exam preparation</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Topic</label>
          <input
            {...register('topic', { required: 'Topic is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            placeholder="e.g., World War II, Photosynthesis"
          />
          {errors.topic && <p className="mt-2 text-sm text-red-600">{errors.topic.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Difficulty</label>
          <select
            {...register('difficulty', { required: 'Difficulty is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
          >
            <option value="">Select difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {errors.difficulty && <p className="mt-2 text-sm text-red-600">{errors.difficulty.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Quiz'
          )}
        </button>
      </form>

      {output && (
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Quiz</h2>
            <button
              onClick={handleCopyToClipboard}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Quiz
                </>
              )}
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{output}</p>
          </div>
        </div>
      )}
    </div>
  );
}
