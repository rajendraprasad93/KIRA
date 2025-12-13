// WardHeader - Ward information header with performance metrics

import React from 'react';

const WardHeader = ({ ward, timePeriod, onPeriodChange }) => {
    if (!ward) return null;

    return (
        <div style={{
            background: 'linear-gradient(to right, #10B981, #059669)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
            color: 'white'
        }}>
            {/* Header Row */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '0.5rem'
                        }}>
                            🗺️ {ward.name}
                        </h1>
                        <p style={{
                            margin: 0,
                            fontSize: '1.125rem',
                            opacity: 0.95
                        }}>
                            Ward {ward.id} • #{ward.rank} of {ward.totalWards} Wards
                        </p>
                    </div>
                    
                    {/* Time Period Selector */}
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        padding: '0.5rem',
                        borderRadius: '0.75rem'
                    }}>
                        <button
                            onClick={() => onPeriodChange && onPeriodChange('month')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                backgroundColor: timePeriod === 'month' ? 'white' : 'transparent',
                                color: timePeriod === 'month' ? '#10B981' : 'white',
                                fontWeight: timePeriod === 'month' ? '700' : '500',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            📊 Month
                        </button>
                        <button
                            onClick={() => onPeriodChange && onPeriodChange('year')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                backgroundColor: timePeriod === 'year' ? 'white' : 'transparent',
                                color: timePeriod === 'year' ? '#10B981' : 'white',
                                fontWeight: timePeriod === 'year' ? '700' : '500',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            📈 Year
                        </button>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '0.75rem',
                    marginTop: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '0.25rem'
                        }}>
                            {ward.performance.resolutionRate}%
                        </div>
                        <div style={{
                            fontSize: '0.875rem',
                            opacity: 0.95
                        }}>
                            Resolution Rate
                        </div>
                    </div>
                    
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '0.25rem'
                        }}>
                            {ward.performance.avgFixDays} days
                        </div>
                        <div style={{
                            fontSize: '0.875rem',
                            opacity: 0.95
                        }}>
                            Avg Fix Time
                        </div>
                    </div>
                    
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '0.25rem'
                        }}>
                            {ward.performance.satisfaction}%
                        </div>
                        <div style={{
                            fontSize: '0.875rem',
                            opacity: 0.95
                        }}>
                            Satisfaction
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WardHeader;
