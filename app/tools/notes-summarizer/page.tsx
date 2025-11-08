'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Copy, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormData = {
  text: string;
};

export default function NotesSummarizerPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const textValue = watch('text', '');

  useEffect(() => {
    const words = textValue.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [textValue]);

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
      const response = await fetch('/api/runNotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to summarize notes';
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
      toast.success('Notes summarized successfully!');
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Notes Summarizer</h1>
        <p className="text-gray-600 dark:text-gray-400">Transform long notes into concise summaries</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="notes-text">Your Notes</Label>
            <span className="text-sm text-gray-500" aria-live="polite">{wordCount} words</span>
          </div>
          <Textarea
            id="notes-text"
            {...register('text', {
              required: 'Please enter some text to summarize',
              minLength: { value: 10, message: 'Text must be at least 10 characters' }
            })}
            className="mt-2 resize-none"
            placeholder="Paste your lecture notes, textbook content, or study materials..."
            rows={10}
            aria-invalid={errors.text ? 'true' : 'false'}
            aria-describedby={errors.text ? 'notes-error' : undefined}
          />
          {errors.text && <p id="notes-error" className="mt-2 text-sm text-red-600" role="alert">{errors.text.message}</p>}
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
              Summarizing...
            </>
          ) : (
            'Summarize'
          )}
        </Button>
      </form>

      {output && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Summary</h2>
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
                  Copy
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
