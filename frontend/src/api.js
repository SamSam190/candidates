import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const addCandidate = (candidateData) => axios.post(`${API_URL}/candidates`, candidateData);
export const getCandidates = () => axios.get(`${API_URL}/candidates`);
export const matchCandidates = (jobData) => axios.post(`${API_URL}/match`, jobData);
export const getAiRecommendation = (jobData) => axios.post(`${API_URL}/ai/shortlist`, jobData);
