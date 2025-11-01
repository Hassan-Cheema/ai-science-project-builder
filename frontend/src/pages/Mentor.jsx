import AIMentor from '../components/AIMentor';

const Mentor = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧑‍🏫</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Science Mentor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal science tutor! Get instant explanations for any science concept,
            help with your project, or answers to your curious questions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-bold text-gray-900 mb-2">Explain Concepts</h3>
            <p className="text-sm text-gray-600">
              Get simple explanations for complex science topics in your grade level
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">🔬</div>
            <h3 className="font-bold text-gray-900 mb-2">Project Help</h3>
            <p className="text-sm text-gray-600">
              Get suggestions to improve your experiments and hypotheses
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">❓</div>
            <h3 className="font-bold text-gray-900 mb-2">Ask Anything</h3>
            <p className="text-sm text-gray-600">
              No question is too simple - I'm here to help you learn!
            </p>
          </div>
        </div>

        {/* AI Mentor Component */}
        <AIMentor />

        {/* Example Questions */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-3">💭 Example Questions to Try:</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>How does photosynthesis work?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>What makes a good hypothesis?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>How do I design a controlled experiment?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>What's the difference between a theory and a law?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Can you explain Newton's laws simply?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>How do I analyze my experiment data?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentor;

