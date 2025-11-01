'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Loader2, Download } from 'lucide-react';
import { ResumeTemplate } from '@/app/components/resume-template';

type FormData = {
  name: string;
  role: string;
  skills: string;
  experience: string;
  careerGoal?: string;
};

export default function ResumeMakerPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<{ name: string; role: string } | null>(null);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setOutput('');
    setResumeData({ name: data.name, role: data.role });

    try {
      const response = await fetch('/api/runResume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          role: data.role,
          skills: data.skills,
          experience: data.experience,
          careerGoal: data.careerGoal,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to generate resume';
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
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Maker</h1>
        <p className="text-gray-600">Build professional resumes with PDF download</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Target Role</label>
            <input
              {...register('role', { required: 'Role is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="Software Engineer"
            />
            {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Skills</label>
          <textarea
            {...register('skills', { required: 'Skills are required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
            placeholder="JavaScript, React, Node.js, Team Leadership..."
            rows={3}
          />
          {errors.skills && <p className="mt-2 text-sm text-red-600">{errors.skills.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Work Experience</label>
          <textarea
            {...register('experience', { required: 'Experience is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
            placeholder="Describe your work experience, achievements, and responsibilities..."
            rows={5}
          />
          {errors.experience && <p className="mt-2 text-sm text-red-600">{errors.experience.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Career Goal <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            {...register('careerGoal')}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
            placeholder="What are your career aspirations..."
            rows={2}
          />
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
            'Generate Resume'
          )}
        </button>
      </form>

      {isLoading && !output && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
        </div>
      )}

      {output && resumeData && !isLoading && (
        <div>
          <ResumeTemplate 
            content={output} 
            name={resumeData.name} 
            role={resumeData.role} 
          />
        </div>
      )}

      {isLoading && output && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
}
