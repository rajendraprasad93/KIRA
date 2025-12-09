const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Database (In-memory for now)
let issues = [];

// Helper: Simple keyword-based "AI" analysis
const analyzeDescription = (text) => {
  const lower = text.toLowerCase();
  let category = 'others';
  let severity = 'Low';
  let department = 'Public Works';

  if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe')) {
    category = 'water';
    department = 'Water Supply';
    if (lower.includes('huge') || lower.includes('burst') || lower.includes('flood')) severity = 'High';
  } else if (lower.includes('road') || lower.includes('pothole') || lower.includes('crack')) {
    category = 'roads';
    department = 'Roads & Infrastructure';
    if (lower.includes('accident') || lower.includes('deep')) severity = 'High';
  } else if (lower.includes('garbage') || lower.includes('trash') || lower.includes('smell')) {
    category = 'garbage';
    department = 'Sanitation';
    severity = 'Medium';
  } else if (lower.includes('light') || lower.includes('dark') || lower.includes('pole')) {
    category = 'electricity';
    department = 'Electricity';
  }

  // Extract location (naive mock: looks for "near X" or "at X")
  let location = 'Unknown Location';
  const locMatch = text.match(/(?:near|at|in)\s+([^,.]+)/i);
  if (locMatch) {
    location = locMatch[1].trim();
  }

  return { category, severity, department, location };
};

// Routes

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GrievanceGenie Backend is running' });
});

// POST /api/analyze - The "AI" Endpoint
app.post('/api/analyze', (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  // Simulate AI processing delay
  setTimeout(() => {
    const analysis = analyzeDescription(description);
    res.json({
      success: true,
      data: {
        ...analysis,
        summary: `Identified ${analysis.severity} priority ${analysis.category} issue.`
      }
    });
  }, 1000);
});

// POST /api/report - Submit Issue
app.post('/api/report', (req, res) => {
  const issue = req.body;
  const newIssue = {
    id: `GG-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    ...issue,
    status: 'reported',
    reportedAt: new Date(),
    timeline: [{ status: 'Reported', date: new Date() }],
    verifications: { yes: 0, no: 0, notSure: 0, total: 0 }
  };
  
  issues.push(newIssue);
  console.log('New Issue Logged:', newIssue.id);
  
  res.json({ success: true, issue: newIssue });
});

// GET /api/issues - Get All Issues
app.get('/api/issues', (req, res) => {
  res.json(issues);
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
