'use client';

import { Check, Copy, Loader2, RefreshCw, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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

      const result = await response.json();

      if (!response.ok) {
        setOutput(`Error: ${result.error || 'Failed to process text'}`);
        setIsLoading(false);
        return;
      }

      setOutput(result.result);
      setIsLoading(false);
    } catch {
      setOutput(`Error: Network error. Please try again.`);
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
          <label className="block text-sm font-medium text-gray-900 mb-3">Mode</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue('mode', 'paraphrase', { shouldValidate: true })}
              className={`p-4 border-2 rounded-xl transition-all text-left ${
                modeValue === 'paraphrase'
                  ? 'border-gray-900 bg-white ring-4 ring-gray-900/10'
                  : 'border-gray-200 hover:border-gray-400 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className={`w-5 h-5 ${modeValue === 'paraphrase' ? 'text-gray-900' : 'text-gray-400'}`} />
                <span className={`font-bold text-lg ${modeValue === 'paraphrase' ? 'text-gray-900' : 'text-gray-700'}`}>
                  Paraphrase
                </span>
              </div>
              <p className={`text-sm ${modeValue === 'paraphrase' ? 'text-gray-600' : 'text-gray-500'}`}>
                Rewrite text with different words while keeping the same meaning
              </p>
            </button>

            <button
              type="button"
              onClick={() => setValue('mode', 'humanize', { shouldValidate: true })}
              className={`p-4 border-2 rounded-xl transition-all text-left ${
                modeValue === 'humanize'
                  ? 'border-gray-900 bg-white ring-4 ring-gray-900/10'
                  : 'border-gray-200 hover:border-gray-400 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <User className={`w-5 h-5 ${modeValue === 'humanize' ? 'text-gray-900' : 'text-gray-400'}`} />
                <span className={`font-bold text-lg ${modeValue === 'humanize' ? 'text-gray-900' : 'text-gray-700'}`}>
                  Humanize
                </span>
              </div>
              <p className={`text-sm ${modeValue === 'humanize' ? 'text-gray-600' : 'text-gray-500'}`}>
                Make AI-generated text sound natural and human-written
              </p>
            </button>
          </div>
          <input type="hidden" {...register('mode', { required: true })} />
        </div>

        {/* Text Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-900">Your Text</label>
            <span className="text-sm text-gray-500">{wordCount} words</span>
          </div>
          <textarea
            {...register('text', {
              required: 'Please enter some text to process',
              minLength: { value: 10, message: 'Text must be at least 10 characters' }
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
            placeholder={modeValue === 'humanize'
              ? 'Paste AI-generated text here to make it sound more human...'
              : 'Paste your text here to paraphrase it...'}
            rows={10}
          />
          {errors.text && <p className="mt-2 text-sm text-red-600">{errors.text.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
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
        </button>
      </form>

      {output && (
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {modeValue === 'humanize' ? 'Humanized Text' : 'Paraphrased Text'}
            </h2>
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
                  Copy
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
