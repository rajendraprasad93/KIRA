// LiveIndicator - Shows real-time status for in-progress complaints

import React from 'react';

const LiveIndicator = ({ status, eta, showPulse = true }) => {
    if (status !== 'en_route' && status !== 'working') {
        return null;
    }

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.25rem 0.625rem',
            backgroundColor: '#FEF3C7',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#92400E'
        }}>
            {showPulse && (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#10B981',
                        borderRadius: '50%',
                        position: 'relative',
                        zIndex: 2
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#10B981',
                        borderRadius: '50%',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }} />
                </div>
            )}
            <span>
                {status === 'en_route' ? '🚗 En Route' : '🔧 Working'}
                {eta && ` • ETA ${eta}`}
            </span>

            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0;
                        transform: scale(2);
                    }
                }
            `}</style>
        </div>
    );
};

export default LiveIndicator;
