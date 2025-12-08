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

      {issue.verifications && issue.verifications.total > 0 && (
        <div className="mt-3 pt-3 border-t flex items-center gap-2">
          <Users className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            {issue.verifications.yes} of {issue.verifications.total} locals confirmed
          </span>
        </div>
      )}
    </div>
  );
};

export default IssueCard;