import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const StatusTimeline = ({ timeline, currentStatus }) => {
  const allStatuses = ['Reported', 'Being verified', 'Assigned', 'In Progress', 'Resolved'];
  
  const getStatusIcon = (status, isComplete) => {
    if (isComplete) {
      return <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--success)' }} />;
    } else if (status === currentStatus) {
      return <Clock className="w-6 h-6" style={{ color: 'var(--warning)' }} />;
    } else {
      return <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: '#ddd' }}></div>;
    }
  };

  const getStatusDate = (status) => {
    const timelineItem = timeline.find(t => 
      t.status.toLowerCase() === status.toLowerCase() ||
      (status === 'Being verified' && t.status.toLowerCase() === 'being verified')
    );
    return timelineItem ? new Date(timelineItem.date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }) : null;
  };

  const isStatusComplete = (status) => {
    const currentIndex = allStatuses.indexOf(currentStatus);
    const statusIndex = allStatuses.indexOf(status);
    return statusIndex < currentIndex || 
           (status === currentStatus && timeline.find(t => t.status === status));
  };

  return (
    <div className="card">
      <h3 className="mb-6" style={{ color: 'var(--text-primary)' }}>Status Timeline</h3>
      <div className="space-y-6">
        {allStatuses.map((status, index) => {
          const isComplete = isStatusComplete(status);
          const isCurrent = status === currentStatus;
          const date = getStatusDate(status);

          return (
            <div key={status} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                {getStatusIcon(status, isComplete)}
                {index < allStatuses.length - 1 && (
                  <div 
                    className="w-0.5 h-12 mt-2"
                    style={{ 
                      backgroundColor: isComplete ? 'var(--success)' : '#ddd'
                    }}
                  ></div>
                )}
              </div>
              <div className="flex-1 pb-2">
                <p 
                  className="font-semibold"
                  style={{ 
                    color: isComplete || isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {status}
                </p>
                {date && (
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {date}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;