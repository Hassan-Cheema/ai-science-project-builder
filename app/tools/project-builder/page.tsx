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
import { BookOpen, Check, Copy, Loader2, Sparkles, Target, Zap } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormData = {
  topic: string;
  grade: string;
  budget: string;
  goal: string;
};

export default function ProjectBuilderPage() {
  const { register, handleSubmit, formState: { errors }, watch, control } = useForm<FormData>();
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  // Watch form values for real-time UI updates
  const watchedValues = watch(['topic', 'grade', 'budget', 'goal']);
  const isFormValid = watchedValues.every(val => val && val !== '');

  const handleCopyToClipboard = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    }
  }, [output]);

  const onSubmit = useCallback(async (data: FormData) => {
    setIsLoading(true);
    setOutput('');
    setProgress(0);

    try {
      const response = await fetch('/api/runProject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: data.topic,
          grade: data.grade,
          budget: data.budget,
          goal: data.goal,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to generate project';
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

      toast.success('Project generation started!');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setOutput('Error: Unable to read response stream');
        setIsLoading(false);
        return;
      }

      let accumulatedText = '';
      let charCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        charCount += chunk.length;

        // Update progress based on character count (rough estimate)
        const estimatedProgress = Math.min(95, Math.floor((charCount / 5000) * 100));
        setProgress(estimatedProgress);

        setOutput(accumulatedText);
      }

      setProgress(100);
      setIsLoading(false);
      toast.success('Project generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
      toast.error(errorMessage);
      setOutput(`Error: ${errorMessage}`);
      setIsLoading(false);
      setProgress(0);
    }
  }, []);

  // Memoized formatted output component
  const formattedOutput = useMemo(() => {
    if (!output) return null;

    return output.split('\n').map((line, index) => {
      // Format headings
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900 first:mt-0 border-b border-gray-200 pb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Format bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={index} className="ml-6 my-2 flex items-start">
            <span className="mr-3 text-blue-600 mt-1">•</span>
            <span className="flex-1">{line.replace(/^[-•]\s*/, '')}</span>
          </div>
        );
      }
      // Format numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={index} className="ml-6 my-2 flex items-start">
            <span className="mr-3 text-blue-600 font-medium">{line.trim().match(/^\d+\./)?.[0]}</span>
            <span className="flex-1">{line.trim().replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="my-3 leading-relaxed text-gray-700">
            {line}
          </p>
        );
      }
      // Empty lines for spacing
      return <br key={index} />;
    });
  }, [output]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Enhanced Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">AI-Powered Project Builder</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Project Builder</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create detailed, competition-ready science project plans with AI assistance
        </p>
      </div>

      {/* Enhanced Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topic Input */}
          <div className="md:col-span-2">
            <Label htmlFor="topic" className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4" />
              Project Topic
            </Label>
            <Input
              id="topic"
              {...register('topic', { required: 'Topic is required' })}
              placeholder="e.g., Volcano Eruption, Solar System, Photosynthesis"
              className="h-12"
              aria-invalid={errors.topic ? 'true' : 'false'}
              aria-describedby={errors.topic ? 'topic-error' : undefined}
            />
            {errors.topic && (
              <p id="topic-error" className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                {errors.topic.message}
              </p>
            )}
          </div>

          {/* Grade Select */}
          <div>
            <Label htmlFor="grade" className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" />
              Grade Level
            </Label>
            <Controller
              name="grade"
              control={control}
              rules={{ required: 'Grade is required' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="grade" className="h-12 w-full" aria-invalid={errors.grade ? 'true' : 'false'}>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                      <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.grade && (
              <p id="grade-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.grade.message}
              </p>
            )}
          </div>

          {/* Budget Select */}
          <div>
            <Label htmlFor="budget" className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" />
              Budget Range
            </Label>
            <Controller
              name="budget"
              control={control}
              rules={{ required: 'Budget is required' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="budget" className="h-12 w-full" aria-invalid={errors.budget ? 'true' : 'false'}>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low - Basic materials, household items</SelectItem>
                    <SelectItem value="Medium">Medium - Standard lab supplies</SelectItem>
                    <SelectItem value="High">High - Professional equipment and materials</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.budget && (
              <p id="budget-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.budget.message}
              </p>
            )}
          </div>

          {/* Goal Select */}
          <div className="md:col-span-2">
            <Label htmlFor="goal" className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" />
              Project Goal
            </Label>
            <Controller
              name="goal"
              control={control}
              rules={{ required: 'Goal is required' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="goal" className="h-12 w-full" aria-invalid={errors.goal ? 'true' : 'false'}>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Demo">Demo - Classroom demonstration or presentation</SelectItem>
                    <SelectItem value="Competition">Competition - Science fair or competition entry</SelectItem>
                    <SelectItem value="Research">Research - Academic research or investigation</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.goal && (
              <p id="goal-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.goal.message}
              </p>
            )}
          </div>
        </div>

        {/* Enhanced Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !isFormValid}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Project...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Project</span>
            </>
          )}
        </Button>

        {/* Progress Bar */}
        {isLoading && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </form>

      {/* Enhanced Output Display */}
      {(output || isLoading) && (
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4 bg-white shadow-lg animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Your Project Plan
            </h2>
            {!isLoading && output && (
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6 max-h-[700px] overflow-y-auto custom-scrollbar">
            {isLoading && !output ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-gray-600 font-medium">Crafting your project plan...</p>
                <p className="text-sm text-gray-500">This may take a moment</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {formattedOutput}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
