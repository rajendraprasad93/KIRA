// MyComplaintsPage - Main screen for tracking user complaints

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useComplaints from '../../hooks/useComplaints';
import StatusTabs from '../../components/MyComplaints/StatusTabs';
import ComplaintCardEnhanced from '../../components/MyComplaints/ComplaintCardEnhanced';
import VerificationSection from '../../components/MyComplaints/VerificationSection';
import BottomNav from '../../components/common/BottomNav';

const MyComplaintsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    // Mock user ID - In production, get from auth context
    const userId = user?.phone || '9876543210';

    const {
        complaints,
        counts,
        loading,
        error,
        filter,
        setFilter,
        refresh,
        wsConnected
    } = useComplaints(userId, 'all');

    const handleRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const getEmptyStateMessage = () => {
        const messages = {
            all: {
                emoji: '👋',
                title: 'No complaints yet!',
                message: 'Report your first issue to earn +25 points',
                action: 'Report Issue'
            },
            pending: {
                emoji: '✅',
                title: 'No pending complaints',
                message: 'All your issues are being processed',
                action: null
            },
            in_progress: {
                emoji: '🎯',
                title: 'No active work',
                message: 'Workers will be assigned soon',
                action: null
            },
            resolved: {
                emoji: '🏆',
                title: 'No resolved issues yet',
                message: 'Your first resolution will appear here',
                action: null
            },
            closed: {
                emoji: '📁',
                title: 'No closed complaints',
                message: 'Closed issues appear here after 30 days',
                action: null
            }
        };
        return messages[filter] || messages.all;
    };

    const emptyState = getEmptyStateMessage();

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F3F4F6',
            paddingBottom: '80px'
        }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(to right, #10B981, #059669)',
                padding: '1.5rem',
                paddingBottom: '2rem',
                color: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                fontSize: '1.25rem',
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ←
                        </button>
                        <div>
                            <h1 style={{
                                margin: 0,
                                fontSize: '1.25rem',
                                fontWeight: 'bold'
                            }}>
                                📋 My Complaints
                            </h1>
                            <p style={{
                                margin: 0,
                                fontSize: '0.875rem',
                                opacity: 0.9
                            }}>
                                {counts.all} Total Issues
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                fontSize: '1.25rem',
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                cursor: refreshing ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: refreshing ? 0.5 : 1,
                                animation: refreshing ? 'spin 1s linear infinite' : 'none'
                            }}
                        >
                            🔄
                        </button>
                        <button
                            onClick={() => navigate('/report')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                fontSize: '1.25rem',
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ➕
                        </button>
                    </div>
                </div>

                {/* Connection Status */}
                {wsConnected && (
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.25rem 0.625rem',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#10B981',
                            borderRadius: '50%',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }} />
                        <span>Live Updates Active</span>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main style={{
                padding: '1rem',
                marginTop: '-1rem'
            }}>
                {/* Status Filter Tabs */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    marginBottom: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <StatusTabs
                        activeFilter={filter}
                        counts={counts}
                        onFilterChange={setFilter}
                    />
                </div>

                {/* Loading State */}
                {loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            width: '3rem',
                            height: '3rem',
                            border: '4px solid #E5E7EB',
                            borderTopColor: '#10B981',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '1rem'
                        }} />
                        <p style={{
                            margin: 0,
                            fontSize: '0.875rem',
                            color: '#6B7280'
                        }}>
                            Loading your complaints...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div style={{
                        backgroundColor: '#FEE2E2',
                        border: '1px solid #FECACA',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <p style={{
                            margin: 0,
                            fontSize: '0.875rem',
                            color: '#991B1B',
                            fontWeight: '600'
                        }}>
                            ⚠️ {error}
                        </p>
                        <button
                            onClick={handleRefresh}
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#DC2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Complaints List */}
                {!loading && !error && (
                    <>
                        {complaints.length > 0 ? (
                            <div>
                                <h2 style={{
                                    margin: '0 0 1rem 0',
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    color: '#6B7280',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {complaints.length} Issue{complaints.length !== 1 ? 's' : ''} Found
                                </h2>
                                
                                {complaints.map(complaint => (
                                    <ComplaintCardEnhanced
                                        key={complaint.id}
                                        complaint={complaint}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '0.75rem',
                                padding: '3rem 2rem',
                                textAlign: 'center',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    fontSize: '4rem',
                                    marginBottom: '1rem'
                                }}>
                                    {emptyState.emoji}
                                </div>
                                <h3 style={{
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: '#111827'
                                }}>
                                    {emptyState.title}
                                </h3>
                                <p style={{
                                    margin: '0 0 1.5rem 0',
                                    fontSize: '0.875rem',
                                    color: '#6B7280'
                                }}>
                                    {emptyState.message}
                                </p>
                                {emptyState.action && (
                                    <button
                                        onClick={() => navigate('/report')}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#10B981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                                        }}
                                    >
                                        ➕ {emptyState.action}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Community Verification Section */}
                        {complaints.length > 0 && (
                            <VerificationSection />
                        )}
                    </>
                )}
            </main>

            <BottomNav />

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0;
                        transform: scale(1.5);
                    }
                }
            `}</style>
        </div>
    );
};

export default MyComplaintsPage;
