'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Loader2, Copy, Check, Lightbulb } from 'lucide-react';

type FormData = {
  topic: string;
  type: string;
};

interface Idea {
  title: string;
  description: string;
}

export default function IdeaGeneratorPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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

      const result = await response.json();

      if (!response.ok) {
        alert(`Error: ${result.error || 'Failed to generate ideas'}`);
        setIsLoading(false);
        return;
      }

      setIdeas(result.ideas);
      setIsLoading(false);
    } catch (error) {
      alert(`Error: Network error. Please try again.`);
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
          <label className="block text-sm font-medium text-gray-900 mb-2">Topic or Field</label>
          <input
            {...register('topic', { required: 'Topic is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            placeholder="e.g., AI, Healthcare, Education"
          />
          {errors.topic && <p className="mt-2 text-sm text-red-600">{errors.topic.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Type of Ideas</label>
          <select
            {...register('type', { required: 'Type is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
          >
            <option value="">Select type</option>
            <option value="Project">Project</option>
            <option value="Startup">Startup</option>
            <option value="Research">Research</option>
            <option value="Random">Random</option>
          </select>
          {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>}
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
            'Generate Ideas'
          )}
        </button>
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
            <button
              onClick={handleCopyAll}
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
                  Copy All
                </>
              )}
            </button>
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
