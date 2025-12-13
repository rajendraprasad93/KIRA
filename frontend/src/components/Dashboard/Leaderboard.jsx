
import React from 'react';

const LeaderboardRow = ({ rank, name, points, isUser }) => (
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0.75rem', 
        backgroundColor: isUser ? '#FEFCE8' : 'transparent',
        borderBottom: '1px solid #F3F4F6'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
                width: '24px', 
                height: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: rank === 1 ? '#FEF3C7' : (rank === 2 ? '#F3F4F6' : '#FFF7ED'),
                borderRadius: '50%',
                fontSize: '0.875rem'
            }}>
                {rank === 1 ? '🥇' : (rank === 2 ? '🥈' : '🥉')}
            </span>
            <div>
                <span style={{ fontSize: '0.875rem', fontWeight: isUser ? '600' : '400', color: isUser ? '#B45309' : '#374151' }}>
                    {name} {isUser && '(You)'}
                </span>
            </div>
        </div>
        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10B981' }}>{points} pts</span>
    </div>
);

const Leaderboard = ({ list, onViewTop10 }) => {
    return (
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>👥 Top Reporters</h3>
                <button 
                    onClick={onViewTop10}
                    style={{ fontSize: '0.75rem', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                >
                    View Top 10 →
                </button>
            </div>
            
            <div>
                {list.map(user => (
                   <LeaderboardRow key={user.rank} {...user} /> 
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
