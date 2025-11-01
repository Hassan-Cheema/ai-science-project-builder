import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-notion-text mb-6 leading-tight">
              Create Amazing Science Projects with{' '}
              <span className="text-notion-blue">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-notion-gray mb-10 leading-relaxed">
              Generate creative project ideas, hypotheses, and visualizations in seconds. 
              Perfect for students, teachers, and science enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/try"
                className="bg-notion-blue hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Try it free →
              </Link>
              <Link
                to="/pricing"
                className="bg-white hover:bg-gray-50 text-notion-text px-8 py-4 rounded-lg font-semibold text-lg transition-all border-2 border-gray-200 hover:border-notion-blue"
              >
                View pricing
              </Link>
            </div>
            <p className="text-notion-gray text-sm mt-6">
              ✨ No credit card required • Generate 3 projects free
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-notion-text mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-notion-gray max-w-2xl mx-auto">
              Powered by GPT-4o mini and advanced data visualization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-notion-lightgray p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-notion-text mb-3">AI-Powered Ideas</h3>
              <p className="text-notion-gray leading-relaxed">
                Get creative, testable science project ideas tailored to your subject and grade level
              </p>
            </div>
            
            <div className="bg-notion-lightgray p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-notion-text mb-3">Data Visualization</h3>
              <p className="text-notion-gray leading-relaxed">
                Automatically generate beautiful charts and graphs to support your hypothesis
              </p>
            </div>
            
            <div className="bg-notion-lightgray p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-notion-text mb-3">Complete Reports</h3>
              <p className="text-notion-gray leading-relaxed">
                Generate comprehensive project reports in markdown format, ready to present
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-notion-lightgray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-notion-text mb-4">
              How it works
            </h2>
            <p className="text-lg text-notion-gray">
              Three simple steps to your perfect science project
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-notion-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-notion-text mb-2">Choose Your Topic</h3>
              <p className="text-notion-gray">
                Select your subject area and enter a topic you're interested in
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-notion-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-notion-text mb-2">AI Generates Ideas</h3>
              <p className="text-notion-gray">
                Our AI creates unique project ideas with testable hypotheses
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-notion-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-notion-text mb-2">Get Your Report</h3>
              <p className="text-notion-gray">
                Download complete project reports with visualizations included
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to create your first project?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and teachers already using AI Science Builder
          </p>
          <Link
            to="/try"
            className="inline-block bg-white text-notion-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start for free →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

