import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [apiStatus, setApiStatus] = useState('checking...');

  useEffect(() => {
    checkApiConnection();
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Welcome to your dashboard! You are successfully authenticated.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">User Information</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="text-sm text-gray-900 break-all">{user?.uid}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">API Status</h2>
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${apiStatus === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-900 capitalize">{apiStatus}</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-md font-medium transition-colors">
              Create New Project
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-md font-medium transition-colors">
              View Analytics
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-md font-medium transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

