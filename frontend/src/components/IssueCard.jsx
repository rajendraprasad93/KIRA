import React from 'react';
import { MapPin, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IssueCard = ({ issue, showViewButton = true, onClick }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusMap = {
      reported: { text: 'Reported', class: 'badge-primary' },
      verifying: { text: 'Verifying', class: 'badge-warning' },
      assigned: { text: 'Assigned', class: 'badge-accent' },
      in_progress: { text: 'In Progress', class: 'badge-accent' },
      resolved: { text: 'Resolved', class: 'badge-success' },
      unverified: { text: 'Unverified', class: 'badge-error' }
    };
    const statusInfo = statusMap[status] || statusMap.reported;
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getSeverityBadge = (severity) => {
    const severityMap = {
      High: 'badge-error',
      Medium: 'badge-warning',
      Low: 'badge-primary'
    };
    return <span className={`badge ${severityMap[severity]}`}>{severity}</span>;
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (showViewButton) {
      navigate(`/issue/${issue.id}`);
    }
  };

  return (
    <div 
      className="card cursor-pointer" 
      onClick={handleClick}
      style={{ transition: 'all 0.3s ease' }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="mono-text font-semibold" style={{ color: 'var(--primary)' }}>
            {issue.id}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {issue.categoryName}
          </p>
        </div>
        <div className="flex gap-2">
          {getSeverityBadge(issue.severity)}
          {getStatusBadge(issue.status)}
        </div>
      </div>

      <p className="mb-3" style={{ color: 'var(--text-primary)' }}>
        {issue.description.length > 150 
          ? `${issue.description.substring(0, 150)}...` 
          : issue.description}
      </p>

      <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{issue.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(issue.reportedAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short'
            })}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t grid grid-cols-2 gap-2">
         {/* Evidence Score (AI) */}
         <div className="bg-gray-100 p-2 rounded flex flex-col items-center justify-center text-center">
            <span className="text-xs text-gray-500 font-semibold uppercase">AI Evidence</span>
            <span className={`text-lg font-bold ${
              (issue.evidenceScore || 0) > 80 ? 'text-green-600' : 
              (issue.evidenceScore || 0) > 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {issue.evidenceScore || 'N/A'}/100
            </span>
         </div>

         {/* Crowd Score (Verification) */}
         <div className="bg-gray-100 p-2 rounded flex flex-col items-center justify-center text-center">
            <span className="text-xs text-gray-500 font-semibold uppercase">Crowd Score</span>
            <div className="flex items-center gap-1">
               <Users className="w-4 h-4 text-blue-500" />
               <span className={`text-lg font-bold ${
                 (issue.verifications?.yes * 2 - issue.verifications?.no) >= 5 ? 'text-green-600' :
                 (issue.verifications?.yes * 2 - issue.verifications?.no) >= 0 ? 'text-blue-600' : 'text-red-600'
               }`}>
                 {issue.verifications ? (issue.verifications.yes * 2 - issue.verifications.no) : 0}
               </span>
            </div>
         </div>
      </div>
      
      {issue.source === 'social_media' && (
        <div className="absolute top-2 right-2 -mr-2 -mt-2">
           <span className="badge badge-info shadow-lg border-white border-2">Social Signal</span>
        </div>
      )}
    </div>
  );
};

export default IssueCard;