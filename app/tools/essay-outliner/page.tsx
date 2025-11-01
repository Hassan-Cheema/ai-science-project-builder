'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Loader2, Copy, Check, List } from 'lucide-react';

type OutlineData = {
  topic: string;
  essayType: string;
};

const steps = [
  { number: 1, label: 'Topic' },
  { number: 2, label: 'Essay Type' },
];

const essayTypes = [
  { value: 'classic', name: 'Classic', desc: 'A traditional essay with a clear thesis statement and supporting evidence.', badge: 'default' },
  { value: 'persuasive', name: 'Persuasive', desc: 'An essay aimed at convincing readers of a specific viewpoint.' },
  { value: 'personal', name: 'Personal Statement', desc: 'An essay written to showcase goals and experiences for college admissions or scholarships.' },
  { value: 'book-report', name: 'Book Report', desc: 'An essay that analyzes a book, its characters, and its themes.' },
  { value: 'critique', name: 'Critique', desc: 'A critical analysis of a work or concept.' },
  { value: 'compare', name: 'Compare/Contrast', desc: 'An essay that analyzes similarities and differences between subjects.' },
];

export default function EssayOutlinerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OutlineData>>({});
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [suggestedTopics] = useState([
    'The Effects of Social Media on Mental Health',
    'Climate Change and Its Global Impact',
    'The Future of Artificial Intelligence',
  ]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setCurrentStep(3);

    try {
      const response = await fetch('/api/runOutline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          essayType: formData.essayType || 'classic',
        }),
      });

      const responseText = await response.text();
      const result = JSON.parse(responseText);

      if (!response.ok) {
        setOutput(`Error: ${result.error || 'Failed to generate outline'}`);
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

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="-m-8 bg-gray-50 min-h-screen">
      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Back button */}
            {currentStep > 1 && currentStep < 3 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            
            {/* Steps */}
            <div className="flex items-center gap-8 mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      step.number === currentStep 
                        ? 'bg-gray-900 text-white' 
                        : step.number < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.number < currentStep ? '✓' : step.number}
                    </div>
                    <span className={`text-sm font-medium ${
                      step.number === currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* STEP 1: Topic */}
          {currentStep === 1 && (
            <div className="space-y-12">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                  What would you like to outline?
                </h1>
                <p className="text-xl text-gray-600">
                  Enter your topic to get a structured outline
                </p>
              </div>

              <div className="space-y-6">
                <input
                  type="text"
                  value={formData.topic || ''}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-6 py-6 text-xl bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400"
                  placeholder="Type your topic here..."
                  autoFocus
                />

                {suggestedTopics.length > 0 && (
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-4">Suggested Topics:</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {suggestedTopics.map((topic, i) => (
                        <button
                          key={i}
                          onClick={() => setFormData({ ...formData, topic })}
                          className="text-left px-5 py-4 bg-white border-2 border-gray-200 hover:border-gray-900 rounded-2xl text-gray-700 transition-all text-sm leading-snug"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.topic || formData.topic.length < 3}
                  className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Essay Type */}
          {currentStep === 2 && (
            <div className="space-y-12">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                  What type of essay outline?
                </h1>
                <p className="text-xl text-gray-600">
                  Select the type to structure your outline
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {essayTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, essayType: type.value })}
                    className={`text-left border-2 rounded-2xl p-6 transition-all ${
                      formData.essayType === type.value
                        ? 'border-gray-900 bg-white ring-4 ring-gray-900/10'
                        : 'border-gray-200 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="font-bold text-xl text-gray-900">{type.name}</div>
                      {type.badge && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {type.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{type.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleGenerate}
                  disabled={!formData.essayType}
                  className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-lg"
                >
                  <List className="w-5 h-5" />
                  Generate Outline
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Output/Loading */}
          {currentStep === 3 && (
            <div>
              {isLoading ? (
                <div className="min-h-[60vh] flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-20 h-20 text-gray-900 animate-spin mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Creating your outline...</h2>
                    <p className="text-gray-600">Organizing structure and key points</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Essay Outline</h1>
                      <p className="text-gray-600">{formData.essayType} • {formData.topic}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setCurrentStep(1);
                          setOutput('');
                          setFormData({});
                        }}
                        className="px-6 py-3 border-2 border-gray-300 hover:border-gray-900 rounded-xl font-semibold transition-all"
                      >
                        New Outline
                      </button>
                      <button
                        onClick={handleCopyToClipboard}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                          copied
                            ? 'bg-green-50 border-2 border-green-600 text-green-700'
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-5 h-5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-12">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-900 leading-[1.8] whitespace-pre-wrap">
                        {output}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

