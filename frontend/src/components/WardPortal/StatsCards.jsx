// StatsCards - Animated statistics cards for ward metrics

import React, { useEffect, useState } from 'react';

const StatsCards = ({ stats }) => {
    const [displayedStats, setDisplayedStats] = useState({
        totalIssues: 0,
        resolved: 0,
        pending: 0,
        todayNew: 0,
        todayResolved: 0
    });

    useEffect(() => {
        if (!stats) return;

        // Animate counters
        const duration = 1500; // 1.5 seconds
        const steps = 30;
        const interval = duration / steps;
        
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            
            setDisplayedStats({
                totalIssues: Math.floor(stats.totalIssues * progress),
                resolved: Math.floor(stats.resolved * progress),
                pending: Math.floor(stats.pending * progress),
                todayNew: Math.floor(stats.todayNew * progress),
                todayResolved: Math.floor(stats.todayResolved * progress)
            });
            
            if (step >= steps) {
                clearInterval(timer);
                setDisplayedStats({
                    totalIssues: stats.totalIssues,
                    resolved: stats.resolved,
                    pending: stats.pending,
                    todayNew: stats.todayNew,
                    todayResolved: stats.todayResolved
                });
            }
        }, interval);

        return () => clearInterval(timer);
    }, [stats]);

    if (!stats) return null;

    const cards = [
        {
            value: displayedStats.totalIssues,
            label: 'Total Issues',
            sublabel: `+${displayedStats.todayNew} today`,
            color: '#3B82F6',
            bgColor: '#DBEAFE',
            icon: '📊'
        },
        {
            value: displayedStats.resolved,
            label: 'Resolved',
            sublabel: `+${displayedStats.todayResolved} today`,
            color: '#10B981',
            bgColor: '#D1FAE5',
            icon: '✅'
        },
        {
            value: displayedStats.pending,
            label: 'Pending',
            sublabel: 'In queue',
            color: '#F59E0B',
            bgColor: '#FEF3C7',
            icon: '⏳'
        },
        {
            value: stats.avgFixTime,
            label: 'Avg Fix Time',
            sublabel: 'vs 14d city avg',
            color: '#8B5CF6',
            bgColor: '#EDE9FE',
            icon: '⚡',
            noAnimation: true
        }
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
        }}>
            {cards.map((card, index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '0.75rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                        e.currentTarget.style.borderColor = card.color;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.5rem'
                    }}>
                        <div style={{
                            fontSize: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: card.bgColor,
                            borderRadius: '0.5rem'
                        }}>
                            {card.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: card.color,
                                lineHeight: 1
                            }}>
                                {card.value}
                            </div>
                        </div>
                    </div>
                    <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#4B5563',
                        marginBottom: '0.25rem'
                    }}>
                        {card.label}
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: card.color,
                        fontWeight: '500'
                    }}>
                        {card.sublabel}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
