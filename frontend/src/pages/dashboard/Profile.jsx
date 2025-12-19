import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import Navbar from '../../components/layout/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    resumeText: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        resumeText: user.resumeText || user.resume_text || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update resume text
      await authAPI.updateResume(formData.resumeText);
      
      // Update user info in localStorage
      const updatedUser = {
        ...user,
        fullName: formData.fullName,
        email: formData.email,
        resumeText: formData.resumeText,
        resume_text: formData.resumeText,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile updated successfully! 🎉');
      
      // Refresh page after 1 second to update context
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getCharCount = () => {
    return formData.resumeText.length;
  };

  const getWordCount = () => {
    return formData.resumeText.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
          <p className="mt-1 text-gray-600">
            Manage your account information and resume
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md animate-shake">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-shake">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.fullName}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Member since:</span>
                    <br />
                    {new Date(user?.createdAt || user?.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Stats */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Resume Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Characters</span>
                  <span className="text-sm font-semibold text-gray-900">{getCharCount()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Words</span>
                  <span className="text-sm font-semibold text-gray-900">{getWordCount()}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className={`text-xs font-medium ${getWordCount() >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                    {getWordCount() >= 100 
                      ? '✓ Good resume length for AI analysis'
                      : '⚠ Add more details for better AI matching'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Name cannot be changed at this time
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed at this time
                  </p>
                </div>

                {/* Resume Text */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume / CV Text
                  </label>
                  <textarea
                    name="resumeText"
                    value={formData.resumeText}
                    onChange={handleChange}
                    rows="12"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                    placeholder="Paste your resume content here...

Example:
John Doe - Full Stack Developer

EXPERIENCE:
- 3 years building web applications with React, Node.js, and PostgreSQL
- Developed RESTful APIs serving 10k+ daily users
- Led team of 3 developers on e-commerce platform

SKILLS:
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Python
- Database: PostgreSQL, MongoDB
- Cloud: AWS, Docker, Kubernetes

EDUCATION:
- BS Computer Science - University Name (2020)"
                  ></textarea>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      💡 Keep your resume updated for accurate AI matching
                    </p>
                    <p className="text-xs text-gray-500">
                      {getCharCount()} characters • {getWordCount()} words
                    </p>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h5 className="text-sm font-bold text-blue-900 mb-2">
                    💡 Tips for Better AI Matching:
                  </h5>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Include specific technologies and tools you've used</li>
                    <li>• Mention years of experience with each skill</li>
                    <li>• Add quantifiable achievements (e.g., "increased performance by 30%")</li>
                    <li>• List certifications and education</li>
                    <li>• Keep it concise but comprehensive (200-500 words is ideal)</li>
                  </ul>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;