import { useState } from 'react';
import axios from 'axios';
import { downloadProjectPDF } from '../services/pdfService';

const API_BASE_URL = 'http://localhost:8000';

const ResultsComponent = ({ results }) => {
  const [activeTab, setActiveTab] = useState('idea');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const tabs = [
    { id: 'idea', label: 'Project Idea', icon: '💡' },
    { id: 'hypothesis', label: 'Hypothesis', icon: '🔬' },
    { id: 'visualization', label: 'Data Visualization', icon: '📊' },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleDownloadPDF = async () => {
    setGeneratingPDF(true);
    try {
      // Call backend to generate full report
      const response = await axios.post(`${API_BASE_URL}/api/report`, null, {
        params: {
          idea: results.idea,
          hypothesis: results.hypothesis,
          graph_description: results.graphDescription
        }
      });

      // Prepare data for PDF
      const pdfData = {
        title: results.title,
        idea: results.idea,
        hypothesis: results.hypothesis,
        graphBase64: results.graphBase64,
        report: response.data.report
      };

      // Generate and download PDF
      const result = await downloadProjectPDF(pdfData, `${results.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      
      if (result.success) {
        alert('PDF downloaded successfully! ✅');
      } else {
        alert('Failed to generate PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Make sure the backend is running.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium text-notion-blue mb-1">Your Generated Project</div>
              <h2 className="text-2xl md:text-3xl font-bold text-notion-text">{results.title}</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className="px-6 py-2.5 bg-notion-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generatingPDF ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    📄 Download PDF
                  </>
                )}
              </button>
              <button
                onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
                className="px-4 py-2.5 bg-white text-notion-blue border-2 border-notion-blue rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                Copy All
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex space-x-1 px-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-sm font-semibold transition-all border-b-3 rounded-t-lg ${
                  activeTab === tab.id
                    ? 'border-notion-blue text-notion-blue bg-blue-50'
                    : 'border-transparent text-notion-gray hover:text-notion-text hover:bg-gray-50'
                }`}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'idea' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm">
                <h3 className="text-lg font-semibold text-notion-text mb-4 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Project Description
                </h3>
                <div className="prose prose-blue max-w-none">
                  <p className="text-notion-text text-base leading-relaxed whitespace-pre-wrap">{results.idea}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(results.idea)}
                className="inline-flex items-center gap-2 text-notion-blue hover:text-blue-600 text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy idea
              </button>
            </div>
          )}

          {activeTab === 'hypothesis' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100 shadow-sm">
                <h3 className="text-lg font-semibold text-notion-text mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔬</span>
                  Testable Hypothesis
                </h3>
                <div className="bg-white border-l-4 border-notion-blue p-5 rounded-r-lg shadow-sm">
                  <p className="text-notion-text text-base leading-relaxed italic">{results.hypothesis}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
                <h4 className="font-semibold text-notion-text mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Tips for Testing Your Hypothesis
                </h4>
                <ul className="text-sm text-notion-text space-y-2.5 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Define your independent and dependent variables clearly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Plan at least 3-5 trials to ensure reliability and consistency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Keep a detailed lab notebook with observations and measurements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Analyze your data with appropriate graphs and statistical methods</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => copyToClipboard(results.hypothesis)}
                className="inline-flex items-center gap-2 text-notion-blue hover:text-blue-600 text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy hypothesis
              </button>
            </div>
          )}

          {activeTab === 'visualization' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100 shadow-sm">
                <h3 className="text-lg font-semibold text-notion-text mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Sample Data Visualization
                </h3>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <img
                    src={`data:image/png;base64,${results.graphBase64}`}
                    alt="Project Data Visualization"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 shadow-sm">
                <p className="text-sm text-notion-text leading-relaxed">{results.graphDescription}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`data:image/png;base64,${results.graphBase64}`}
                  download="project-graph.png"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-notion-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Graph
                </a>
                <button
                  onClick={() => copyToClipboard(results.graphDescription)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-notion-text rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Description
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gradient-to-r from-notion-lightgray to-blue-50 px-8 py-5 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-notion-gray font-medium">
              ✨ Want more features? Check out our pricing plans
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 border-2 border-gray-300 text-notion-text rounded-lg text-sm font-semibold hover:bg-white transition-all shadow-sm hover:shadow-md"
              >
                Generate Another
              </button>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="px-5 py-2.5 bg-gradient-to-r from-notion-blue to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                View Pricing →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent;

