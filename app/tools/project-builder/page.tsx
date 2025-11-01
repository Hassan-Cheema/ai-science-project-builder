'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';

type FormData = {
  topic: string;
  grade: string;
};

export default function ProjectBuilderPage() {
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
      const response = await fetch('/api/runProject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: data.topic, grade: data.grade }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to generate project';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        setOutput(`Error: ${errorMessage}`);
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setOutput('Error: Unable to read response stream');
        setIsLoading(false);
        return;
      }

      let accumulatedText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setOutput(accumulatedText);
      }

      setIsLoading(false);
    } catch (error) {
      setOutput(`Error: Network error. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Builder</h1>
        <p className="text-gray-600">Create detailed science project plans</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Topic</label>
          <input
            {...register('topic', { required: 'Topic is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            placeholder="e.g., Volcano Eruption, Solar System"
          />
          {errors.topic && <p className="mt-2 text-sm text-red-600">{errors.topic.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Grade</label>
          <select
            {...register('grade', { required: 'Grade is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
          >
            <option value="">Select grade</option>
            {[5, 6, 7, 8, 9, 10, 11, 12].map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
          {errors.grade && <p className="mt-2 text-sm text-red-600">{errors.grade.message}</p>}
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
            'Generate Project'
          )}
        </button>
      </form>

      {(output || isLoading) && (
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Project</h2>
            {!isLoading && output && (
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
            )}
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
            {isLoading && !output ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{output}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
