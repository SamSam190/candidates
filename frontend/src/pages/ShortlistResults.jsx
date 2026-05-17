import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ShortlistResults = () => {
  const location = useLocation();
  const { candidates, aiRecommendation, jobReq } = location.state || { candidates: [], aiRecommendation: '', jobReq: {} };

  if (!location.state) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-gray-700">No results found</h2>
        <Link to="/match" className="text-indigo-600 underline mt-4 block">Go back to match</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* AI Insight Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">🤖</span>
          <h2 className="text-2xl font-bold text-indigo-900">AI Recommendation</h2>
        </div>
        <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap">
          {aiRecommendation || 'No recommendation available.'}
        </div>
      </div>

      {/* Candidates List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shortlisted Candidates</h2>
        {candidates.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-lg text-center shadow-sm">No candidates matched the minimum experience criteria.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {candidates.map((candidate, index) => (
              <div key={candidate._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {index + 1}. {candidate.name}
                    </h3>
                    <p className="text-sm text-gray-500">{candidate.email} • {candidate.experience} years exp.</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      candidate.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                      candidate.matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {candidate.matchScore.toFixed(0)}% Match
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Matched Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.matchedSkills.length > 0 ? (
                      candidate.matchedSkills.map((skill, i) => (
                        <span key={i} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">All Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {candidate.projects && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Bio / Projects:</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{candidate.projects}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistResults;
