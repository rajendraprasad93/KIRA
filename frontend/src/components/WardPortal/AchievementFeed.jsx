// AchievementFeed - Display ward achievements and milestones

import React from 'react';

const AchievementFeed = ({ achievements }) => {
    if (!achievements || achievements.length === 0) return null;

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginTop: '2rem'
        }}>
            <h3 style={{
                margin: '0 0 1.5rem 0',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                🏆 Ward Achievements
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem'
            }}>
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        style={{
                            padding: '1.25rem',
                            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                            borderRadius: '0.75rem',
                            border: '2px solid #F59E0B',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {/* Badge Icon */}
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '0.75rem',
                            textAlign: 'center'
                        }}>
                            {achievement.badge}
                        </div>

                        {/* Title */}
                        <div style={{
                            fontSize: '1rem',
                            fontWeight: '700',
                            color: '#92400E',
                            marginBottom: '0.5rem',
                            textAlign: 'center'
                        }}>
                            {achievement.title}
                        </div>

                        {/* Description */}
                        <div style={{
                            fontSize: '0.875rem',
                            color: '#B45309',
                            textAlign: 'center',
                            marginBottom: '0.75rem',
                            lineHeight: '1.4'
                        }}>
                            {achievement.description}
                        </div>

                        {/* Date */}
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#D97706',
                            textAlign: 'center',
                            fontWeight: '600'
                        }}>
                            📅 {achievement.date}
                        </div>

                        {/* Decorative corner */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, transparent 50%, rgba(245, 158, 11, 0.2) 50%)',
                            pointerEvents: 'none'
                        }} />
                    </div>
                ))}
            </div>

            {/* Overall Summary */}
            <div style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                background: 'linear-gradient(to right, #ECFDF5, #D1FAE5)',
                borderRadius: '0.75rem',
                border: '2px solid #10B981'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ fontSize: '2.5rem' }}>🎖️</div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: '#065F46',
                            marginBottom: '0.25rem'
                        }}>
                            Outstanding Performance!
                        </div>
                        <div style={{
                            fontSize: '0.875rem',
                            color: '#059669',
                            lineHeight: '1.5'
                        }}>
                            Ashok Nagar continues to lead with {achievements.length} major achievements. 
                            Keep up the excellent work! 🌟
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementFeed;
