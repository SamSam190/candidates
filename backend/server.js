require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Candidate = require('./models/Candidate');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/candidate-shortlisting';

// Connect to DB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 1. Add Candidate
app.post('/api/candidates', async (req, res) => {
  try {
    const { name, email, skills, experience, projects } = req.body;
    const candidate = new Candidate({ name, email, skills, experience, projects });
    await candidate.save();
    res.status(201).json({ message: 'Candidate added successfully', candidate });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Get All Candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Shortlist Candidates (Basic Logic)
app.post('/api/match', async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    
    // Validate inputs
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'requiredSkills array is needed' });
    }

    const candidates = await Candidate.find();
    
    // Filter out by minimum experience if provided (optional)
    let filteredCandidates = candidates;
    if (minExperience !== undefined) {
      filteredCandidates = candidates.filter(c => c.experience >= minExperience);
    }
    
    // Match logic
    const matched = filteredCandidates.map(candidate => {
      const matchedSkills = candidate.skills.filter(skill =>
        requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );
      
      const score = requiredSkills.length > 0 
        ? matchedSkills.length / requiredSkills.length 
        : 0;
      
      return {
        ...candidate.toObject(),
        matchScore: score * 100, // percentage
        matchedSkills
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
    
    res.json(matched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. AI-Based Candidate Suggestion
app.post('/api/ai/shortlist', async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    const candidates = await Candidate.find();
    
    if (candidates.length === 0) {
      return res.json({ aiRecommendation: "No candidates available for shortlisting." });
    }
    
    // Prepare candidates text for prompt
    const candidatesText = candidates.map((c, i) => 
      `${i + 1}. ${c.name} - Skills: ${c.skills.join(', ')} - Experience: ${c.experience} years`
    ).join('\n');
    
    const prompt = `
Job requires: ${requiredSkills.join(', ')} (Min ${minExperience || 0} years experience)
Candidates:
${candidatesText}

Rank candidates based on the job requirements and explain why. Be concise. Provide the output in a clear format.
    `;

    // Fetch from OpenRouter API
    const fetch = (await import('node-fetch')).default || global.fetch; // Node 18+ has global fetch
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // fallback model, can be updated
        messages: [{ role: "user", content: prompt }]
      })
    });
    
    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      res.json({ aiRecommendation: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'Failed to get response from AI', details: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
