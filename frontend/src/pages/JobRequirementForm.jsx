import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchCandidates, getAiRecommendation } from '../api';

const JobRequirementForm = () => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    minExperience: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
      const requestData = {
        requiredSkills: skillsArray,
        minExperience: Number(formData.minExperience) || 0
      };

      // Fetch basic matching
      const matchRes = await matchCandidates(requestData);
      
      // Fetch AI suggestion
      const aiRes = await getAiRecommendation(requestData);
      
      navigate('/results', {
        state: {
          candidates: matchRes.data,
          aiRecommendation: aiRes.data.aiRecommendation,
          jobReq: requestData
        }
      });
    } catch (error) {
      console.error(error);
      alert('Failed to match candidates. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Find Best Candidates</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma-separated)</label>
          <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} required
                 className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" 
                 placeholder="React, Node.js" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Experience (Years)</label>
          <input type="number" name="minExperience" value={formData.minExperience} onChange={handleChange} required min="0" step="0.1"
                 className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" 
                 placeholder="1" />
        </div>
        
        <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-md transition duration-200 shadow-md flex justify-center items-center">
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Matching Candidates...
            </span>
          ) : (
            'Match & Get AI Insights'
          )}
        </button>
      </form>
    </div>
  );
};

export default JobRequirementForm;
