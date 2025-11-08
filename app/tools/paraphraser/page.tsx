'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Copy, Loader2, RefreshCw, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormData = {
  text: string;
  mode: 'paraphrase' | 'humanize';
};

export default function ParaphraserPage() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      mode: 'paraphrase',
    },
  });
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const textValue = watch('text', '');
  const modeValue = watch('mode', 'paraphrase');

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
      const response = await fetch('/api/runParaphraser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: data.text,
          mode: data.mode,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to process text';
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
      toast.success(modeValue === 'humanize' ? 'Text humanized successfully!' : 'Text paraphrased successfully!');
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Paraphraser & Humanizer</h1>
        <p className="text-gray-600">Rewrite text to sound natural or paraphrase while keeping the same meaning</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Mode Selection */}
        <div>
          <Label className="mb-3">Mode</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={modeValue === 'paraphrase' ? 'default' : 'outline'}
              onClick={() => setValue('mode', 'paraphrase', { shouldValidate: true })}
              className={`h-auto p-4 justify-start text-left ${
                modeValue === 'paraphrase'
                  ? 'ring-4 ring-gray-900/10'
                  : ''
              }`}
            >
              <div className="w-full">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className={`w-5 h-5 ${modeValue === 'paraphrase' ? 'text-gray-900' : 'text-gray-400'}`} />
                  <span className={`font-bold text-lg ${modeValue === 'paraphrase' ? 'text-gray-900' : 'text-gray-700'}`}>
                    Paraphrase
                  </span>
                </div>
                <p className={`text-sm ${modeValue === 'paraphrase' ? 'text-gray-600' : 'text-gray-500'}`}>
                  Rewrite text with different words while keeping the same meaning
                </p>
              </div>
            </Button>

            <Button
              type="button"
              variant={modeValue === 'humanize' ? 'default' : 'outline'}
              onClick={() => setValue('mode', 'humanize', { shouldValidate: true })}
              className={`h-auto p-4 justify-start text-left ${
                modeValue === 'humanize'
                  ? 'ring-4 ring-gray-900/10'
                  : ''
              }`}
            >
              <div className="w-full">
                <div className="flex items-center gap-2 mb-2">
                  <User className={`w-5 h-5 ${modeValue === 'humanize' ? 'text-gray-900' : 'text-gray-400'}`} />
                  <span className={`font-bold text-lg ${modeValue === 'humanize' ? 'text-gray-900' : 'text-gray-700'}`}>
                    Humanize
                  </span>
                </div>
                <p className={`text-sm ${modeValue === 'humanize' ? 'text-gray-600' : 'text-gray-500'}`}>
                  Make AI-generated text sound natural and human-written
                </p>
              </div>
            </Button>
          </div>
          <input type="hidden" {...register('mode', { required: true })} />
        </div>

        {/* Text Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="text-input">Your Text</Label>
            <span className="text-sm text-gray-500" aria-live="polite">{wordCount} words</span>
          </div>
          <Textarea
            id="text-input"
            {...register('text', {
              required: 'Please enter some text to process',
              minLength: { value: 10, message: 'Text must be at least 10 characters' }
            })}
            className="mt-2 resize-none"
            placeholder={modeValue === 'humanize'
              ? 'Paste AI-generated text here to make it sound more human...'
              : 'Paste your text here to paraphrase it...'}
            rows={10}
            aria-invalid={errors.text ? 'true' : 'false'}
            aria-describedby={errors.text ? 'text-error' : undefined}
          />
          {errors.text && <p id="text-error" className="mt-2 text-sm text-red-600" role="alert">{errors.text.message}</p>}
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
              Processing...
            </>
          ) : (
            <>
              {modeValue === 'humanize' ? (
                <>
                  <User className="w-4 h-4" />
                  Humanize Text
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Paraphrase Text
                </>
              )}
            </>
          )}
        </Button>
      </form>

      {output && (
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {modeValue === 'humanize' ? 'Humanized Text' : 'Paraphrased Text'}
            </h2>
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

          <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{output}</p>
          </div>
        </div>
      )}
    </div>
  );
}
