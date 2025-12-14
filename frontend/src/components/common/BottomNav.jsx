
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = ({ style = {}, className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Professional compact navigation - removed Home button
    const navItems = [
        { id: 'report', label: 'REPORT', path: '/report', primary: true, color: '#DC2626' },
        { id: 'complaints', label: 'TRACK', path: '/my-complaints', color: '#1F4E78' },
        { id: 'ward', label: 'WARD', path: '/ward-portal', color: '#F77F00' }
    ];

    const defaultStyle = {
        display: 'flex',
        gap: '0.5rem'
    };

    return (
        <div style={{ ...defaultStyle, ...style }} className={className}>
            {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: `1px solid ${isActive ? item.color : '#E3EEF7'}`,
                            backgroundColor: isActive ? item.color : 'white',
                            color: isActive ? 'white' : item.color,
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em',
                            transition: 'all 0.2s ease',
                            minWidth: '60px',
                            textAlign: 'center'
                        }}
                        onMouseOver={(e) => {
                            if (!isActive) {
                                e.target.style.backgroundColor = item.color;
                                e.target.style.color = 'white';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isActive) {
                                e.target.style.backgroundColor = 'white';
                                e.target.style.color = item.color;
                            }
                        }}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
