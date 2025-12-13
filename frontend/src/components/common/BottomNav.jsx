
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: 'dashboard', label: 'Home', icon: '🏠', path: '/dashboard' },
        { id: 'report', label: 'Report', icon: '➕', path: '/report', primary: true },
        { id: 'complaints', label: 'Complaints', icon: '📋', path: '/my-complaints' },
        { id: 'ward', label: 'Ward', icon: '🗺️', path: '/ward-portal' }
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '0.5rem',
            zIndex: 50
        }}>
            {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: isActive ? '#10B981' : '#6B7280',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        {item.primary ? (
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#10B981',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.25rem',
                                marginBottom: '2px',
                                marginTop: '-20px',
                                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                            }}>
                                {item.icon}
                            </div>
                        ) : (
                            <span style={{ fontSize: '1.5rem', marginBottom: '2px' }}>{item.icon}</span>
                        )}
                        <span style={{ fontSize: '0.625rem', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
