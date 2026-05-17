import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CandidateForm from './pages/CandidateForm';
import JobRequirementForm from './pages/JobRequirementForm';
import ShortlistResults from './pages/ShortlistResults';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white shadow-md p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-600">AI Recruiter</h1>
            <div className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">Add Candidate</Link>
              <Link to="/match" className="text-gray-600 hover:text-indigo-600 font-medium">Find Matches</Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<CandidateForm />} />
            <Route path="/match" element={<JobRequirementForm />} />
            <Route path="/results" element={<ShortlistResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
