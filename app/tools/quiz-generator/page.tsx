'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Check, Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormData = {
  topic: string;
  difficulty: string;
};

export default function QuizGeneratorPage() {
  const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>();
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
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

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to generate quiz';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        toast.error(errorMessage);
        setOutput(`Error: ${errorMessage}`);
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      setOutput(result.result);
      setIsLoading(false);
      toast.success('Quiz generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
      toast.error(errorMessage);
      setOutput(`Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Quiz Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Create custom quizzes for exam preparation</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            {...register('topic', { required: 'Topic is required' })}
            placeholder="e.g., World War II, Photosynthesis"
            className="mt-2"
            aria-invalid={errors.topic ? 'true' : 'false'}
            aria-describedby={errors.topic ? 'topic-error' : undefined}
          />
          {errors.topic && <p id="topic-error" className="mt-2 text-sm text-red-600" role="alert">{errors.topic.message}</p>}
        </div>

        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Controller
            name="difficulty"
            control={control}
            rules={{ required: 'Difficulty is required' }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="difficulty" className="mt-2 w-full" aria-invalid={errors.difficulty ? 'true' : 'false'}>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.difficulty && <p id="difficulty-error" className="mt-2 text-sm text-red-600" role="alert">{errors.difficulty.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Quiz'
          )}
        </Button>
      </form>

      {output && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Quiz</h2>
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
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
            </Button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 max-h-96 overflow-y-auto">
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{output}</p>
          </div>
        </div>
      )}
    </div>
  );
}
