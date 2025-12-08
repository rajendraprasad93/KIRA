import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, List } from 'lucide-react';
import StatusTimeline from '../../components/StatusTimeline';
import { mockIssues } from '../../data/mock';

const SubmissionConfirmation = () => {
  const { issueId } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, would fetch from API
  const issue = mockIssues.find(i => i.id === issueId) || {
    id: issueId,
    categoryName: 'Drainage / Sewage',
    location: 'MG Road, Ward 12',
    reportedAt: new Date(),
    status: 'verifying',
    verifications: { yes: 0, no: 0, notSure: 0, total: 5 },
    timeline: [
      { status: 'Reported', date: new Date() },
      { status: 'Being verified', date: new Date() }
    ]
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <header 
        className="py-4 px-6 shadow-sm"
        style={{ backgroundColor: 'var(--bg-white)' }}
      >
        <div className="container">
          <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
            GrievanceGenie
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="card text-center mb-6">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}
            >
              <CheckCircle2 className="w-12 h-12" style={{ color: 'var(--success)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--success)' }}>
              Thank You!
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
              Your civic issue has been reported successfully.
            </p>
          </div>

          {/* Issue ID */}
          <div className="card mb-6">
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Your Complaint ID
            </p>
            <p 
              className="mono-text text-3xl font-bold"
              style={{ color: 'var(--primary)' }}
            >
              {issue.id}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Save this ID to track your issue
            </p>
          </div>

          {/* Issue Summary */}
          <div className="card mb-6">
            <h3 className="mb-4" style={{ color: 'var(--text-primary)' }}>Issue Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Category</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {issue.categoryName}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Location</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {issue.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Reported At</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {new Date(issue.reportedAt).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <StatusTimeline timeline={issue.timeline} currentStatus="Being verified" />

          {/* Community Verification Info */}
          <div className="card mb-6">
            <h3 className="mb-3" style={{ color: 'var(--text-primary)' }}>
              Community Verification in Progress
            </h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              People living near this location will get a notification to confirm if this issue is real. 
              If enough people confirm, your report gets higher priority.
            </p>
            <div 
              className="p-4 rounded-md"
              style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
            >
              <p className="font-semibold" style={{ color: 'var(--accent)' }}>
                Verification Status: {issue.verifications.yes} of {issue.verifications.total} locals confirmed
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/my-issues')}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <List className="w-5 h-5" />
              Go to My Issues
            </button>
            <button
              onClick={() => navigate('/report')}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Report Another Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;