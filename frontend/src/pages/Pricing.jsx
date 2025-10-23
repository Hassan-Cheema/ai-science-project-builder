import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out the platform',
      features: [
        '3 project generations',
        'Basic data visualizations',
        'Project ideas & hypotheses',
        'Community support',
      ],
      limitations: [
        'No report generation',
        'No project saving',
      ],
      cta: 'Get Started',
      ctaLink: '/try',
      popular: false,
    },
    {
      name: 'Student',
      price: '$9',
      period: 'per month',
      description: 'Ideal for students working on projects',
      features: [
        'Unlimited project generations',
        'Advanced visualizations',
        'Full report generation',
        'Save up to 50 projects',
        'Multiple export formats',
        'Priority support',
      ],
      limitations: [],
      cta: 'Start Free Trial',
      ctaLink: '/login',
      popular: true,
    },
    {
      name: 'Educator',
      price: '$29',
      period: 'per month',
      description: 'Best for teachers and schools',
      features: [
        'Everything in Student, plus:',
        'Unlimited project storage',
        'Classroom management',
        'Student accounts (up to 30)',
        'Bulk project generation',
        'Custom templates',
        'API access',
        'Dedicated support',
      ],
      limitations: [],
      cta: 'Contact Sales',
      ctaLink: '#',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-notion-lightgray">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-notion-text mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-notion-gray max-w-2xl mx-auto">
            Choose the perfect plan for your science project needs
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-sm border-2 ${
                plan.popular ? 'border-notion-blue' : 'border-gray-200'
              } overflow-hidden flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-notion-blue text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold text-notion-text mb-2">{plan.name}</h3>
                <p className="text-notion-gray text-sm mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-notion-text">{plan.price}</span>
                  <span className="text-notion-gray ml-2">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-notion-text text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-notion-gray text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-0">
                <Link
                  to={plan.ctaLink}
                  className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-notion-blue text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                      : 'bg-notion-lightgray text-notion-text hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-notion-text text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-notion-lightgray p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-notion-text mb-2">
                Can I try before I buy?
              </h3>
              <p className="text-notion-gray">
                Absolutely! The Free plan lets you generate 3 complete projects to see how the platform works. No credit card required.
              </p>
            </div>

            <div className="bg-notion-lightgray p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-notion-text mb-2">
                What subjects are supported?
              </h3>
              <p className="text-notion-gray">
                We support Biology, Chemistry, Physics, Earth Science, Environmental Science, and Astronomy. More subjects are being added regularly!
              </p>
            </div>

            <div className="bg-notion-lightgray p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-notion-text mb-2">
                How does the Educator plan work?
              </h3>
              <p className="text-notion-gray">
                The Educator plan includes multiple student accounts, classroom management tools, and bulk project generation. Perfect for teachers managing multiple classes.
              </p>
            </div>

            <div className="bg-notion-lightgray p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-notion-text mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-notion-gray">
                Yes! All paid plans are billed monthly and can be canceled at any time. No long-term contracts or commitments.
              </p>
            </div>

            <div className="bg-notion-lightgray p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-notion-text mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-notion-gray">
                We accept all major credit cards and debit cards through our secure payment processor, Lemon Squeezy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our team is here to help you find the right plan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/try"
              className="inline-block bg-white text-notion-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Try it free
            </Link>
            <a
              href="#"
              className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border-2 border-blue-400"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

