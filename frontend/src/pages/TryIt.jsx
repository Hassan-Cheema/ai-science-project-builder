import { useState } from 'react';
import axios from 'axios';
import ResultsComponent from '../components/ResultsComponent';

const API_BASE_URL = 'http://localhost:8000';

const TryIt = () => {
  const [formData, setFormData] = useState({
    subject: 'biology',
    topic: '',
    grade: '9-12'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const subjects = [
    { value: 'biology', label: 'Biology', icon: '🧬' },
    { value: 'chemistry', label: 'Chemistry', icon: '⚗️' },
    { value: 'physics', label: 'Physics', icon: '⚛️' },
    { value: 'earth-science', label: 'Earth Science', icon: '🌍' },
    { value: 'environmental', label: 'Environmental Science', icon: '🌱' },
    { value: 'astronomy', label: 'Astronomy', icon: '🔭' },
  ];

  const grades = [
    { value: '6-8', label: 'Middle School (6-8)' },
    { value: '9-12', label: 'High School (9-12)' },
    { value: 'college', label: 'College' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);

    try {
      // Generate project idea
      const topicText = formData.topic 
        ? `${formData.subject} - ${formData.topic} (Grade ${formData.grade})`
        : `${formData.subject} (Grade ${formData.grade})`;
      
      const ideaResponse = await axios.get(`${API_BASE_URL}/api/idea`, {
        params: { topic: topicText }
      });

      // Generate graph
      const graphResponse = await axios.get(`${API_BASE_URL}/api/graph`, {
        params: {
          title: ideaResponse.data.title,
          categories: 'Trial 1,Trial 2,Trial 3,Trial 4,Trial 5',
          values: '45,62,58,71,65'
        }
      });

      setResults({
        title: ideaResponse.data.title,
        idea: ideaResponse.data.idea,
        hypothesis: ideaResponse.data.hypothesis,
        graphBase64: graphResponse.data.graph_base64,
        graphDescription: graphResponse.data.description
      });
    } catch (err) {
      console.error('Error:', err);
      setError(
        err.response?.data?.detail || 
        'Failed to generate project. Make sure the backend server is running and OpenAI API key is configured.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-notion-lightgray py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-notion-text mb-4">
            Generate Your Science Project
          </h1>
          <p className="text-lg text-notion-gray">
            Tell us what you're interested in, and our AI will create a unique project for you
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-semibold text-notion-text mb-3">
                Select Subject
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, subject: subject.value }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.subject === subject.value
                        ? 'border-notion-blue bg-notion-lightblue'
                        : 'border-gray-200 hover:border-notion-blue bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-1">{subject.icon}</div>
                    <div className="text-sm font-medium text-notion-text">{subject.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-notion-text mb-2">
                What topic are you interested in? (Optional)
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="e.g., photosynthesis, renewable energy, ocean currents..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-notion-blue focus:border-transparent text-notion-text placeholder-notion-gray"
              />
              <p className="mt-2 text-sm text-notion-gray">
                Leave blank for AI to choose a topic for you
              </p>
            </div>

            {/* Grade Level */}
            <div>
              <label htmlFor="grade" className="block text-sm font-semibold text-notion-text mb-2">
                Grade Level
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-notion-blue focus:border-transparent text-notion-text bg-white"
              >
                {grades.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-notion-blue hover:bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating your project...
                </span>
              ) : (
                'Generate Project ✨'
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {results && <ResultsComponent results={results} />}
      </div>
    </div>
  );
};

export default TryIt;

