// CategoryTrends - Display category-wise performance trends

import React from 'react';

const CategoryTrends = ({ trends }) => {
    if (!trends || trends.length === 0) return null;

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
                display:'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                📊 Category Performance
            </h3>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
            }}>
                {trends.map((trend, index) => (
                    <div key={index}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                flex: 1
                            }}>
                                <span style={{ fontSize: '1.25rem' }}>{trend.icon}</span>
                                <div>
                                    <div style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#111827'
                                    }}>
                                        {trend.category}
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: '#6B7280'
                                    }}>
                                        {trend.resolved}/{trend.total} resolved
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: trend.color
                            }}>
                                {trend.rate}%
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '9999px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${trend.rate}%`,
                                height: '100%',
                                backgroundColor: trend.color,
                                borderRadius: '9999px',
                                transition: 'width 1s ease-out'
                            }} />
                        </div>

                        {/* Avg Days */}
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#9CA3AF',
                            marginTop: '0.25rem'
                        }}>
                            Avg: {trend.avgDays} days
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Card */}
            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: '#F0FDF4',
                border: '1px solid #A7F3D0',
                borderRadius: '0.5rem'
            }}>
                <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#065F46',
                    marginBottom: '0.25rem'
                }}>
                    🏆 Best Performance
                </div>
                <div style={{
                    fontSize: '0.75rem',
                    color: '#059669'
                }}>
                    {trends[0]?.category} leading with {trends[0]?.rate}% resolution rate!
                </div>
            </div>
        </div>
    );
};

export default CategoryTrends;
