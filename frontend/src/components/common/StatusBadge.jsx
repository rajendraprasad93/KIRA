
import React from 'react';

const StatusBadge = ({ status }) => {
    let color = '#6B7280'; // Default gray
    let bg = '#F3F4F6';
    let text = 'Unknown';

    switch (status) {
        case 'pending':
            color = '#EF4444'; // Red
            bg = '#FEF2F2';
            text = 'Pending';
            break;
        case 'in_progress':
             color = '#F59E0B'; // Amber
             bg = '#FFFBEB';
             text = 'In Progress';
             break;
        case 'resolved':
            color = '#10B981'; // Green
            bg = '#ECFDF5';
            text = 'Resolved';
            break;
        default:
            break;
    }

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: bg,
            color: color
        }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, marginRight: '0.375rem' }}></span>
            {text}
        </span>
    );
};

export default StatusBadge;
