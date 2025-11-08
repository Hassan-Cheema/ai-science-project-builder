'use client';

import { Check, Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
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

type FormData = {
  topic: string;
  type: string;
};

interface Idea {
  title: string;
  description: string;
}

export default function IdeaGeneratorPage() {
  const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    try {
      const allIdeas = ideas.map((idea, index) =>
        `${index + 1}. ${idea.title}\n${idea.description}\n`
      ).join('\n');

      await navigator.clipboard.writeText(allIdeas);
      setCopied(true);
      toast.success('All ideas copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setIdeas([]);

    try {
      const response = await fetch('/api/runIdea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: data.topic, type: data.type }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to generate ideas';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      const result = await response.json();

      // Validate response structure
      if (!result.ideas || !Array.isArray(result.ideas)) {
        toast.error('Invalid response format');
        setIsLoading(false);
        return;
      }

      setIdeas(result.ideas);
      setIsLoading(false);
      toast.success('Ideas generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Idea Generator</h1>
        <p className="text-gray-600">Brainstorm creative ideas for projects and startups</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="topic">Topic or Field</Label>
          <Input
            id="topic"
            {...register('topic', { required: 'Topic is required' })}
            placeholder="e.g., AI, Healthcare, Education"
            className="mt-2"
            aria-invalid={errors.topic ? 'true' : 'false'}
            aria-describedby={errors.topic ? 'topic-error' : undefined}
          />
          {errors.topic && <p id="topic-error" className="mt-2 text-sm text-red-600" role="alert">{errors.topic.message}</p>}
        </div>

        <div>
          <Label htmlFor="type">Type of Ideas</Label>
          <Controller
            name="type"
            control={control}
            rules={{ required: 'Type is required' }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type" className="mt-2 w-full" aria-invalid={errors.type ? 'true' : 'false'}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Startup">Startup</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Random">Random</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && <p id="type-error" className="mt-2 text-sm text-red-600" role="alert">{errors.type.message}</p>}
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
            'Generate Ideas'
          )}
        </Button>
      </form>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
        </div>
      )}

      {ideas.length > 0 && !isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Ideas</h2>
            <Button
              onClick={handleCopyAll}
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
                  Copy All
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-6 hover:border-gray-900 hover:shadow-sm transition-all"
              >
                <div className="flex gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm ml-11">
                  {idea.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
