import React, { useState } from 'react';
import { addCandidate } from '../api';

const CandidateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    projects: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      const dataToSubmit = {
        ...formData,
        skills: skillsArray,
        experience: Number(formData.experience)
      };
      
      await addCandidate(dataToSubmit);
      setStatus({ type: 'success', message: 'Candidate added successfully!' });
      setFormData({ name: '', email: '', skills: '', experience: '', projects: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.error || 'Failed to add candidate.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Add Candidate</h2>
      {status && (
        <div className={`p-4 mb-6 rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required
                 className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" 
                 placeholder="Rahul Sharma" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required
                 className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" 
                 placeholder="rahul@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} required
                 className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" 
                 placeholder="React, Node.js, MongoDB" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} required min="0" step="0.1"
                 className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" 
                 placeholder="2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Projects / Bio</label>
          <textarea name="projects" value={formData.projects} onChange={handleChange} rows="4"
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" 
                    placeholder="Brief description of projects or candidate's bio..."></textarea>
        </div>
        <button type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition duration-200 transform hover:scale-[1.01]">
          Save Candidate
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
