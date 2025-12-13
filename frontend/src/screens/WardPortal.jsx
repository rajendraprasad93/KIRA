// WardPortal - Main ward transparency portal screen

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WardHeader from '../components/WardPortal/WardHeader';
import StatsCards from '../components/WardPortal/StatsCards';
import WardMap from '../components/WardPortal/WardMap';
import CategoryTrends from '../components/WardPortal/CategoryTrends';
import VotingSection from '../components/WardPortal/VotingSection';
import AchievementFeed from '../components/WardPortal/AchievementFeed';
import mockWardData from '../data/mockWardData';

const WardPortal = () => {
    const { wardId } = useParams();
    const [wardData, setWardData] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [timePeriod, setTimePeriod] = useState('month');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch ward data
        const fetchWardData = async () => {
            setLoading(true);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // In production, this would be: GET /api/ward/:wardId
            setWardData(mockWardData);
            setLoading(false);
        };

        fetchWardData();
    }, [wardId]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom right, #ECFDF5, #DBEAFE)',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{
                    width: '3rem',
                    height: '3rem',
                    border: '4px solid #E5E7EB',
                    borderTopColor: '#10B981',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#059669'
                }}>
                    🔄 Loading Ward Data...
                </p>
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!wardData) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom right, #ECFDF5, #DBEAFE)',
                padding: '2rem'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Ward Not Found
                    </h2>
                    <p style={{ margin: 0, color: '#6B7280' }}>
                        The requested ward data could not be loaded.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #ECFDF5, #DBEAFE)',
            padding: '2rem 1rem',
            paddingBottom: '4rem'
        }}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto'
            }}>
                {/* Ward Header */}
                <WardHeader
                    ward={wardData.ward}
                    timePeriod={timePeriod}
                    onPeriodChange={setTimePeriod}
                />

                {/* Statistics Cards */}
                <StatsCards stats={wardData.stats} />

                {/* Interactive Map */}
                <WardMap
                    pins={wardData.mapPins}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                {/* Two Column Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <CategoryTrends trends={wardData.trends} />
                    <VotingSection votes={wardData.activeVotes} />
                </div>

                {/* Achievement Feed */}
                <AchievementFeed achievements={wardData.achievements} />

                {/* Footer Info */}
                <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        marginBottom: '0.5rem'
                    }}>
                        🌟 Transparency Portal powered by GrievanceGenie
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: '#9CA3AF'
                    }}>
                        Last updated: {new Date().toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <button style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}>
                            📊 Download Report
                        </button>
                        <button style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'white',
                            color: '#10B981',
                            border: '2px solid #10B981',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}>
                            📤 Share Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WardPortal;
