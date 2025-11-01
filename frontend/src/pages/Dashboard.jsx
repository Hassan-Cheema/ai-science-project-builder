import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../config/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [apiStatus, setApiStatus] = useState('checking...');
  const [subscriptionStatus, setSubscriptionStatus] = useState('free'); // 'free', 'student', 'educator'

  useEffect(() => {
    checkApiConnection();
    // In a real app, fetch subscription status from your backend
  }, []);

  const checkApiConnection = async () => {
    try {
      const response = await api.get('/health');
      setApiStatus(response.data.status);
    } catch (error) {
      setApiStatus('disconnected');
      console.error('API connection error:', error);
    }
  };

  const handleSubscribe = (plan) => {
    // Placeholder URL - replace with actual Lemon Squeezy checkout URL
    const checkoutUrls = {
      student: 'https://lemonsqueezy.com/checkout/buy/YOUR-STUDENT-PLAN-ID',
      educator: 'https://lemonsqueezy.com/checkout/buy/YOUR-EDUCATOR-PLAN-ID'
    };

    // Open checkout in new window
    window.open(checkoutUrls[plan], '_blank');
  };

  return (
    <div className="min-h-screen bg-notion-lightgray py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-notion-text mb-2">Welcome back!</h1>
              <p className="text-notion-gray">Manage your projects and subscription</p>
            </div>
            {subscriptionStatus === 'free' && (
              <button
                onClick={() => handleSubscribe('student')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                ⚡ Upgrade to Pro
              </button>
            )}
          </div>
        </div>
        {/* Subscription Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-notion-text mb-1">Current Plan</h2>
              <p className="text-2xl font-bold text-notion-blue capitalize">{subscriptionStatus}</p>
              <p className="text-sm text-notion-gray mt-1">
                {subscriptionStatus === 'free' && '3 projects remaining this month'}
                {subscriptionStatus === 'student' && 'Unlimited projects'}
                {subscriptionStatus === 'educator' && 'Unlimited projects + 30 student accounts'}
              </p>
            </div>
            {subscriptionStatus === 'free' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubscribe('student')}
                  className="bg-notion-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Upgrade to Student
                </button>
                <button
                  onClick={() => handleSubscribe('educator')}
                  className="border-2 border-notion-blue text-notion-blue hover:bg-notion-lightblue px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Upgrade to Educator
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-notion-gray">Projects Created</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-notion-text">0</p>
            <p className="text-sm text-notion-gray mt-1">All time</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-notion-gray">API Status</h3>
              <div className={`h-3 w-3 rounded-full ${apiStatus === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <p className="text-3xl font-bold text-notion-text capitalize">{apiStatus}</p>
            <p className="text-sm text-notion-gray mt-1">Backend connection</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-notion-gray">Account</h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
            <p className="text-lg font-semibold text-notion-text truncate">{user?.email || 'Guest'}</p>
            <p className="text-sm text-notion-gray mt-1">Active member</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-notion-text mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/try"
              className="flex flex-col items-center justify-center p-6 bg-notion-lightgray hover:bg-gray-200 rounded-xl transition-colors text-center"
            >
              <div className="w-12 h-12 bg-notion-blue rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-notion-text">New Project</h3>
              <p className="text-xs text-notion-gray mt-1">Generate idea</p>
            </Link>

            <button className="flex flex-col items-center justify-center p-6 bg-notion-lightgray hover:bg-gray-200 rounded-xl transition-colors text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="font-semibold text-notion-text">My Projects</h3>
              <p className="text-xs text-notion-gray mt-1">View saved</p>
            </button>

            <Link
              to="/pricing"
              className="flex flex-col items-center justify-center p-6 bg-notion-lightgray hover:bg-gray-200 rounded-xl transition-colors text-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-semibold text-notion-text">View Plans</h3>
              <p className="text-xs text-notion-gray mt-1">Compare pricing</p>
            </Link>

            <button className="flex flex-col items-center justify-center p-6 bg-notion-lightgray hover:bg-gray-200 rounded-xl transition-colors text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="font-semibold text-notion-text">Settings</h3>
              <p className="text-xs text-notion-gray mt-1">Account config</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

