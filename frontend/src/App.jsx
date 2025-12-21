import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import { useState, useEffect } from 'react';

function App() {
  const [apiLoading, setApiLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    const handleApiLoading = (event) => {
      setApiLoading(event.detail.loading);
      setLoadingMessage(event.detail.message || 'Loading...');
    };

    window.addEventListener('api-loading', handleApiLoading);
    return () => window.removeEventListener('api-loading', handleApiLoading);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      
      {/* Global Loading Overlay - No separate component needed */}
      {apiLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="flex flex-col items-center">
              {/* Spinner */}
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              
              {/* Message */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {loadingMessage}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Server is waking up, please wait...
              </p>
              <p className="text-xs text-gray-500 mt-2">
                (This may take up to 30 seconds)
              </p>
            </div>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}

export default App;