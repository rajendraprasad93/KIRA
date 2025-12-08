import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CitizenLanding from './pages/citizen/CitizenLanding';
import ReportIssuePage from './pages/citizen/ReportIssuePage';
import SubmissionConfirmation from './pages/citizen/SubmissionConfirmation';
import MyIssuesPage from './pages/citizen/MyIssuesPage';
import IssueDetailPage from './pages/citizen/IssueDetailPage';
import VerificationPage from './pages/citizen/VerificationPage';
import OfficerLogin from './pages/officer/OfficerLogin';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerIssueDetail from './pages/officer/OfficerIssueDetail';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CitizenLanding />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/confirmation/:issueId" element={<SubmissionConfirmation />} />
          <Route path="/my-issues" element={<MyIssuesPage />} />
          <Route path="/issue/:issueId" element={<IssueDetailPage />} />
          <Route path="/verify/:issueId" element={<VerificationPage />} />
          <Route path="/officer/login" element={<OfficerLogin />} />
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          <Route path="/officer/issue/:issueId" element={<OfficerIssueDetail />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;