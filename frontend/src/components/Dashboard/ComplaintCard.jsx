
import React from 'react';
import StatusBadge from '../common/StatusBadge';

const ComplaintCard = ({ complaint }) => {
    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            marginBottom: '0.75rem',
            border: '1px solid #E5E7EB'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>{complaint.id}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>{complaint.category}</h3>
                </div>
                <StatusBadge status={complaint.status} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#4B5563' }}>
                <span>📍 {complaint.location}</span>
                <span style={{ color: '#9CA3AF' }}>•</span>
                <span>🕒 {complaint.daysAgo}d ago</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer'
                }}>
                    📍 Track
                </button>
                <button style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer'
                }}>
                    ⭐ Rate
                </button>
            </div>
        </div>
    );
};

export default ComplaintCard;
