// StatusTabs - Tab navigation for filtering complaints by status

import React from 'react';

const StatusTabs = ({ activeFilter, counts, onFilterChange }) => {
    const tabs = [
        { id: 'all', label: 'ALL', color: '#3B82F6', emoji: '📋' },
        { id: 'pending', label: 'PENDING', color: '#EF4444', emoji: '🔴' },
        { id: 'in_progress', label: 'IN PROGRESS', color: '#F59E0B', emoji: '🟡' },
        { id: 'resolved', label: 'RESOLVED', color: '#10B981', emoji: '🟢' },
        { id: 'closed', label: 'CLOSED', color: '#6B7280', emoji: '⚠️' }
    ];

    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '0.5rem 0',
            marginBottom: '1rem',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
        }}>
            {tabs.map(tab => {
                const isActive = activeFilter === tab.id;
                const count = counts[tab.id] || 0;
                
                return (
                    <button
                        key={tab.id}
                        onClick={() => onFilterChange(tab.id)}
                        style={{
                            flex: '0 0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem 0.875rem',
                            backgroundColor: isActive ? tab.color : 'white',
                            color: isActive ? 'white' : '#4B5563',
                            border: isActive ? 'none' : '1px solid #E5E7EB',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            boxShadow: isActive ? `0 2px 8px ${tab.color}40` : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.backgroundColor = '#F9FAFB';
                                e.currentTarget.style.borderColor = tab.color;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#E5E7EB';
                            }
                        }}
                    >
                        <span style={{ fontSize: '0.875rem' }}>{tab.emoji}</span>
                        <span>{tab.label}</span>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '1.25rem',
                            height: '1.25rem',
                            backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : tab.color + '20',
                            color: isActive ? 'white' : tab.color,
                            borderRadius: '9999px',
                            fontSize: '0.625rem',
                            fontWeight: 'bold',
                            padding: '0 0.25rem'
                        }}>
                            {count}
                        </span>
                    </button>
                );
            })}

            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default StatusTabs;
