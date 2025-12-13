
import React from 'react';

const StatsCard = ({ title, value, subtitle, icon, delay, onClick }) => {
    return (
        <div 
            onClick={onClick}
            style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: '100px',
            animation: `fadeIn 0.5s ease-out ${delay}s backwards`,
            cursor: onClick ? 'pointer' : 'default',
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
            if (onClick) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
            }
        }}
        onMouseLeave={(e) => {
            if (onClick) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
            }
        }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{value}</span>
                <span style={{ fontSize: '1.25rem' }}>{icon}</span>
            </div>
            <div>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', margin: 0 }}>{title}</p>
                {subtitle && <p style={{ fontSize: '0.625rem', color: '#10B981', margin: 0, marginTop: '2px' }}>{subtitle}</p>}
            </div>
            {onClick && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.625rem', color: '#3B82F6', fontWeight: '600' }}>
                    View →
                </div>
            )}
        </div>
    );
};

const StatsCards = ({ user, stats, onPointsClick, onRankClick, onIssuesClick }) => {
    return (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <StatsCard 
                title="Your Points" 
                value={user.points} 
                subtitle="+15 today"
                icon="⭐"
                delay={0.1}
                onClick={onPointsClick}
            />
            <StatsCard 
                title="Rank" 
                value={`#${user.rank}`} 
                subtitle={`of ${user.totalUsersInWard}`}
                icon="🏆"
                delay={0.2}
                onClick={onRankClick}
            />
            <StatsCard 
                title="Issues" 
                value={stats.totalReported} 
                subtitle={`${parseInt((stats.resolved/stats.totalReported)*100)}% Success`}
                icon="📊"
                delay={0.3}
                onClick={onIssuesClick}
            />
        </div>
    );
};

export default StatsCards;
