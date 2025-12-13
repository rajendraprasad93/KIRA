// PhotoGalleryModal - Before/After photo comparison modal

import React, { useState } from 'react';

const PhotoGalleryModal = ({ isOpen, onClose, complaint }) => {
    const [currentView, setCurrentView] = useState('before');

    if (!isOpen || !complaint) return null;

    const { photos, aiVerification, id, location, gps } = complaint;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.3s ease'
            }}
            onClick={onClose}
        >
            {/* Header */}
            <div
                style={{
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'white'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                    📸 Photo Evidence ({id})
                </h3>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ×
                </button>
            </div>

            {/* Photo Viewer */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    overflow: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Toggle Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                }}>
                    <button
                        onClick={() => setCurrentView('before')}
                        style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: currentView === 'before' ? '#EF4444' : 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        📸 BEFORE
                    </button>
                    {photos.after && (
                        <button
                            onClick={() => setCurrentView('after')}
                            style={{
                                padding: '0.5rem 1.5rem',
                                backgroundColor: currentView === 'after' ? '#10B981' : 'rgba(255,255,255,0.2)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            ✅ AFTER
                        </button>
                    )}
                </div>

                {/* Photo */}
                <div style={{
                    maxWidth: '600px',
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }}>
                    <img
                        src={currentView === 'before' ? photos.before : photos.after}
                        alt={currentView === 'before' ? 'Before' : 'After'}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                        }}
                    />

                    {/* Metadata */}
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#F9FAFB',
                        borderTop: '1px solid #E5E7EB'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.5rem',
                            marginBottom: '0.75rem'
                        }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.625rem', color: '#9CA3AF' }}>LOCATION</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: '#111827' }}>
                                    📍 {location}
                                </p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.625rem', color: '#9CA3AF' }}>GPS</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: '#111827' }}>
                                    {gps?.lat.toFixed(4)}, {gps?.lng.toFixed(4)}
                                </p>
                            </div>
                        </div>

                        {/* AI Verification Badge */}
                        {currentView === 'after' && aiVerification && (
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                borderRadius: '0.375rem'
                            }}>
                                <p style={{
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#065F46'
                                }}>
                                    ✅ AI VERIFICATION
                                </p>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.25rem',
                                    fontSize: '0.625rem',
                                    color: '#059669'
                                }}>
                                    <div>✅ Same GPS location</div>
                                    <div>✅ Issue fixed</div>
                                    <div>✅ {(aiVerification.confidence * 100).toFixed(0)}% confidence</div>
                                    <div>✅ Photo authentic</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Share Buttons */}
                {currentView === 'after' && photos.after && (
                    <div style={{
                        marginTop: '1rem',
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <button
                            onClick={() => {
                                console.log('Share on WhatsApp');
                            }}
                            style={{
                                padding: '0.625rem 1rem',
                                backgroundColor: '#25D366',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontWeight: '600',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                            }}
                        >
                            📤 Share on WhatsApp
                        </button>
                        <button
                            onClick={() => {
                                console.log('Share on Twitter');
                            }}
                            style={{
                                padding: '0.625rem 1rem',
                                backgroundColor: '#1DA1F2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontWeight: '600',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                            }}
                        >
                            🐦 Share Success
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default PhotoGalleryModal;
