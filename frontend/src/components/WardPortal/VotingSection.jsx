// VotingSection - Community voting for issue prioritization

import React from 'react';

const VotingSection = ({ votes }) => {
    if (!votes || votes.length === 0) return null;

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%'
        }}>
            <h3 style={{
                margin: '0 0 1.5rem 0',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                🗳️ Community Voting
            </h3>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
            }}>
                {votes.map((vote) => {
                    const urgentPercent = (vote.votes.urgent / vote.totalVotes) * 100;
                    const normalPercent = (vote.votes.normal / vote.totalVotes) * 100;
                    const lowPercent = (vote.votes.low / vote.totalVotes) * 100;

                    return (
                        <div
                            key={vote.id}
                            style={{
                                padding: '1rem',
                                backgroundColor: '#F9FAFB',
                                borderRadius: '0.5rem',
                                border: '1px solid #E5E7EB'
                            }}
                        >
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#6B7280',
                                marginBottom: '0.25rem'
                            }}>
                                {vote.id} • {vote.daysAgo}d ago
                            </div>
                            <div style={{
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                color: '#111827',
                                marginBottom: '0.25rem'
                            }}>
                                {vote.title}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#6B7280',
                                marginBottom: '1rem'
                            }}>
                                📍 {vote.location}
                            </div>

                            {/* Vote Summary */}
                            <div style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#111827',
                                marginBottom: '0.5rem'
                            }}>
                                {vote.totalVotes} community votes:
                            </div>

                            {/* Vote Breakdown */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                marginBottom: '1rem'
                            }}>
                                {/* Urgent */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '0.75rem',
                                        marginBottom: '0.25rem'
                                    }}>
                                        <span style={{ color: '#DC2626', fontWeight: '600' }}>
                                            🔴 Urgent
                                        </span>
                                        <span style={{ color: '#6B7280' }}>
                                            {vote.votes.urgent} ({urgentPercent.toFixed(0)}%)
                                        </span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '6px',
                                        backgroundColor: '#FEE2E2',
                                        borderRadius: '9999px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${urgentPercent}%`,
                                            height: '100%',
                                            backgroundColor: '#DC2626',
                                            borderRadius: '9999px',
                                            transition: 'width 1s ease-out'
                                        }} />
                                    </div>
                                </div>

                                {/* Normal */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '0.75rem',
                                        marginBottom: '0.25rem'
                                    }}>
                                        <span style={{ color: '#F59E0B', fontWeight: '600' }}>
                                            🟡 Normal
                                        </span>
                                        <span style={{ color: '#6B7280' }}>
                                            {vote.votes.normal} ({normalPercent.toFixed(0)}%)
                                        </span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '6px',
                                        backgroundColor: '#FEF3C7',
                                        borderRadius: '9999px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${normalPercent}%`,
                                            height: '100%',
                                            backgroundColor: '#F59E0B',
                                            borderRadius: '9999px',
                                            transition: 'width 1s ease-out'
                                        }} />
                                    </div>
                                </div>

                                {/* Low */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '0.75rem',
                                        marginBottom: '0.25rem'
                                    }}>
                                        <span style={{ color: '#10B981', fontWeight: '600' }}>
                                            🟢 Low
                                        </span>
                                        <span style={{ color: '#6B7280' }}>
                                            {vote.votes.low} ({lowPercent.toFixed(0)}%)
                                        </span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '6px',
                                        backgroundColor: '#D1FAE5',
                                        borderRadius: '9999px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${lowPercent}%`,
                                            height: '100%',
                                            backgroundColor: '#10B981',
                                            borderRadius: '9999px',
                                            transition: 'width 1s ease-out'
                                        }} />
                                    </div>
                                </div>
                            </div>

                            {/* Vote Button */}
                            <button style={{
                                width: '100%',
                                padding: '0.625rem',
                                backgroundColor: '#DBEAFE',
                                border: '1px solid #3B82F6',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#1E40AF',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#3B82F6';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#DBEAFE';
                                e.currentTarget.style.color = '#1E40AF';
                            }}
                            >
                                🗳️ Cast Your Vote
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VotingSection;
