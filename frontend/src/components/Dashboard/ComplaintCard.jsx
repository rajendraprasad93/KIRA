
import React from 'react';
import StatusBadge from '../common/StatusBadge';

const ComplaintCard = ({ complaint }) => {
    // Helper functions for enhanced display
    const getAreaTypeIcon = (type) => {
        const icons = {
            'road_street': '🛣️',
            'footpath': '🚶',
            'public_park': '🌳',
            'residential_area': '🏠',
            'commercial_area': '🏪',
            'government_property': '🏛️',
            'other': '📋'
        };
        return icons[type] || '📋';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'low': '#10B981',
            'medium': '#F59E0B', 
            'high': '#EF4444',
            'critical': '#991B1B'
        };
        return colors[priority] || '#6B7280';
    };

    const getDurationText = (duration) => {
        const texts = {
            'today': 'Today',
            '1_3_days': '1-3 days',
            '3_7_days': '3-7 days',
            'more_than_week': '> 1 week'
        };
        return texts[duration] || 'Unknown';
    };

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            marginBottom: '0.75rem',
            border: `1px solid ${complaint.priority ? getPriorityColor(complaint.priority) + '40' : '#E5E7EB'}`,
            borderLeft: `4px solid ${getPriorityColor(complaint.priority)}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>{complaint.id}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                        {complaint.category}
                    </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {complaint.priority && (
                        <span style={{ 
                            fontSize: '0.625rem', 
                            padding: '0.125rem 0.375rem',
                            backgroundColor: getPriorityColor(complaint.priority) + '20',
                            color: getPriorityColor(complaint.priority),
                            borderRadius: '0.25rem',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            {complaint.priority}
                        </span>
                    )}
                    <StatusBadge status={complaint.status} />
                </div>
            </div>
            
            {/* Enhanced Location Info */}
            <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4B5563', marginBottom: '0.25rem' }}>
                    <span>{getAreaTypeIcon(complaint.affectedAreaType)} {complaint.location}</span>
                    <span style={{ color: '#9CA3AF' }}>•</span>
                    <span>🕒 {getDurationText(complaint.issueDuration)}</span>
                </div>
                
                {/* Confirmed Location */}
                {complaint.confirmedLocation && (
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', fontFamily: 'monospace' }}>
                        📍 {complaint.confirmedLocation.lat.toFixed(4)}°N, {complaint.confirmedLocation.lng.toFixed(4)}°E
                        {complaint.confirmedLocation.label && (
                            <span style={{ fontFamily: 'inherit', marginLeft: '0.5rem' }}>
                                • {complaint.confirmedLocation.label}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Impact Flags */}
            {complaint.impactFlags && complaint.impactFlags.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {complaint.impactFlags.map(flag => {
                            const flagIcons = {
                                'blockingTraffic': '🚗',
                                'blockingPedestrians': '🚶',
                                'causingBadSmell': '👃',
                                'nearSchoolHospital': '🏥',
                                'openToPublicView': '👀'
                            };
                            return (
                                <span key={flag} style={{
                                    fontSize: '0.625rem',
                                    padding: '0.125rem 0.25rem',
                                    backgroundColor: '#FEF3C7',
                                    color: '#92400E',
                                    borderRadius: '0.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.125rem'
                                }}>
                                    {flagIcons[flag]} {flag.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#F0F9FF',
                    border: '1px solid #BAE6FD',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#0891B2',
                    cursor: 'pointer'
                }}>
                    📍 Track Live
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
