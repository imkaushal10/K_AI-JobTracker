import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import { showSuccess, showError, showLoading, dismissToast } from '../../utils/toast';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    resumeText: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      showError('Please upload a PDF file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return;
    }

    const toastId = showLoading('Extracting text from PDF...');
    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('pdf', file);

      const response = await fetch('http://localhost:8080/api/pdf/extract', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadFormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text from PDF');
      }

      dismissToast(toastId);
      
      setFormData(prev => ({
        ...prev,
        resumeText: data.text
      }));

      showSuccess(`✅ Successfully extracted text from ${data.info.fileName}!`);

    } catch (err) {
      dismissToast(toastId);
      showError(err.message || 'Failed to upload PDF. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resumeText.trim()) {
      showError('Please add your resume text before saving');
      return;
    }

    const toastId = showLoading('Saving your profile...');
    setLoading(true);

    try {
      await authAPI.updateResume(formData.resumeText);
      
      const updatedUser = {
        ...user,
        fullName: formData.fullName,
        email: formData.email,
        resumeText: formData.resumeText,
        resume_text: formData.resumeText,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dismissToast(toastId);
      showSuccess('Profile updated successfully! 🎉');
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      dismissToast(toastId);
      showError(err.response?.data?.error || 'Failed to update profile');
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
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
            <p className="mt-1 text-gray-600">
              Manage your account information and resume
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

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

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Dashboard
                </button>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed at this time
                  </p>
                </div>

                {/* Resume Text */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Resume / CV Text
                    </label>
                    <label className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-primary-600 rounded-lg text-xs font-medium text-primary-600 bg-white hover:bg-primary-50 transition-colors">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload PDF
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <textarea
                    name="resumeText"
                    value={formData.resumeText}
                    onChange={handleChange}
                    rows="12"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                    placeholder="Paste your resume content here or upload a PDF...

Example:
John Doe - Full Stack Developer

EXPERIENCE:
- 3 years building web applications with React, Node.js, and PostgreSQL
- Developed RESTful APIs serving 10k+ daily users

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
                      💡 Upload PDF or paste text manually
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

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
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