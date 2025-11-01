'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';

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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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

      const result = await response.json();

      if (!response.ok) {
        setOutput(`Error: ${result.error || 'Failed to summarize notes'}`);
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Notes Summarizer</h1>
        <p className="text-gray-600">Transform long notes into concise summaries</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-900">Your Notes</label>
            <span className="text-sm text-gray-500">{wordCount} words</span>
          </div>
          <textarea
            {...register('text', { 
              required: 'Please enter some text to summarize',
              minLength: { value: 10, message: 'Text must be at least 10 characters' }
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
            placeholder="Paste your lecture notes, textbook content, or study materials..."
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
              Summarizing...
            </>
          ) : (
            'Summarize'
          )}
        </button>
      </form>

      {output && (
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
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
