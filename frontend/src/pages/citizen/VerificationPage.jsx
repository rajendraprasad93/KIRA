import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, HelpCircle, MapPin } from 'lucide-react';
import { mockIssues } from '../../data/mock';
import { toast } from 'sonner';

const VerificationPage = () => {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [response, setResponse] = useState(null);

  const issue = mockIssues.find(i => i.id === issueId) || mockIssues[0];

  const handleVerification = (verificationResponse) => {
    setResponse(verificationResponse);
    setVerified(true);
    toast.success('Thank you for your response!');
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
            GrievanceGenie - Community Verification
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          {!verified ? (
            <>
              {/* Verification Request */}
              <div className="card mb-6 text-center">
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                  Help Verify a Civic Issue Near You
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  A resident has reported an issue in your area. Your confirmation helps the municipality 
                  prioritize real problems.
                </p>
              </div>

              {/* Issue Details */}
              <div className="card mb-6">
                <div className="mb-4">
                  <span className="badge badge-primary">{issue.categoryName}</span>
                </div>
                <h3 className="mb-3 font-bold" style={{ color: 'var(--text-primary)' }}>
                  Reported Issue:
                </h3>
                <p className="mb-4" style={{ color: 'var(--text-primary)' }}>
                  {issue.description}
                </p>
                <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin className="w-4 h-4" />
                  <span>{issue.location}</span>
                </div>
                {issue.photos && issue.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {issue.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Issue ${idx + 1}`}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Verification Question */}
              <div className="card mb-6">
                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
                  Do you see this problem in your area?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleVerification('yes')}
                    className="flex flex-col items-center gap-3 p-6 rounded-md border-2 transition-all"
                    style={{
                      borderColor: 'var(--success)',
                      backgroundColor: 'rgba(76, 175, 80, 0.05)'
                    }}
                  >
                    <CheckCircle2 className="w-12 h-12" style={{ color: 'var(--success)' }} />
                    <span className="font-semibold" style={{ color: 'var(--success)' }}>
                      Yes, I See It
                    </span>
                  </button>
                  <button
                    onClick={() => handleVerification('no')}
                    className="flex flex-col items-center gap-3 p-6 rounded-md border-2 transition-all"
                    style={{
                      borderColor: 'var(--error)',
                      backgroundColor: 'rgba(211, 47, 47, 0.05)'
                    }}
                  >
                    <XCircle className="w-12 h-12" style={{ color: 'var(--error)' }} />
                    <span className="font-semibold" style={{ color: 'var(--error)' }}>
                      No, It's Not Here
                    </span>
                  </button>
                  <button
                    onClick={() => handleVerification('not_sure')}
                    className="flex flex-col items-center gap-3 p-6 rounded-md border-2 transition-all"
                    style={{
                      borderColor: 'var(--warning)',
                      backgroundColor: 'rgba(232, 116, 46, 0.05)'
                    }}
                  >
                    <HelpCircle className="w-12 h-12" style={{ color: 'var(--warning)' }} />
                    <span className="font-semibold" style={{ color: 'var(--warning)' }}>
                      Not Sure
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Thank You Message */}
              <div className="card text-center">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
                >
                  <CheckCircle2 className="w-12 h-12" style={{ color: 'var(--accent)' }} />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
                  Thank You!
                </h2>
                <p className="text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                  Your response has been recorded.
                </p>
                <div 
                  className="p-4 rounded-md mb-6"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Your response helps the municipality prioritize real issues and take action faster. 
                    Community participation makes our city better!
                  </p>
                </div>
                <button
                  onClick={() => navigate('/citizen')}
                  className="btn-primary"
                >
                  Back to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;