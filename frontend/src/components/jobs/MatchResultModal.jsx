import { useState } from 'react';

const MatchResultModal = ({ isOpen, onClose, job, matchResult, onReanalyze, isAnalyzing }) => {
  if (!isOpen || !job) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match! 🎯';
    if (score >= 60) return 'Good Match 👍';
    return 'Needs Improvement 📈';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {job.company_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      AI Match Analysis
                    </h3>
                    <p className="text-primary-100 text-sm">
                      {job.company_name} • {job.job_title}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {isAnalyzing ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Analyzing Your Match...
                </h3>
                <p className="text-gray-600">
                  Our AI is comparing your resume with this job. This may take a few seconds.
                </p>
              </div>
            ) : matchResult ? (
              <>
                {/* Match Score */}
                <div className="text-center mb-8 pb-8 border-b border-gray-200">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-4 shadow-lg">
                    <span className={`text-5xl font-bold text-white`}>
                      {matchResult.matchScore}
                    </span>
                  </div>
                  <h4 className={`text-2xl font-bold ${getScoreColor(matchResult.matchScore)} mb-2`}>
                    {getScoreLabel(matchResult.matchScore)}
                  </h4>
                  <p className="text-gray-600">
                    Your resume matches {matchResult.matchScore}% with this position
                  </p>
                </div>

                {/* Strengths */}
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Your Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {matchResult.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Qualifications */}
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Areas to Improve</h4>
                  </div>
                  <ul className="space-y-2">
                    {matchResult.missingQualifications?.map((missing, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{missing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggestions */}
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Recommendations</h4>
                  </div>
                  <ul className="space-y-2">
                    {matchResult.suggestions?.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Analysis Available
                </h3>
                <p className="text-gray-600 mb-6">
                  Click "Analyze" to get AI-powered insights for this job.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
            >
              Close
            </button>
            {matchResult && !isAnalyzing && (
              <button
                onClick={onReanalyze}
                className="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-md"
              >
                Re-analyze
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResultModal;