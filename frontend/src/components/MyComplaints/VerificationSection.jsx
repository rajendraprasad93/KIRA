// VerificationSection - Community verification for nearby issues

import React, { useState, useEffect } from 'react';
import complaintsService from '../../services/complaintsService';

const VerificationSection = () => {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVerifications();
    }, []);

    const loadVerifications = async () => {
        try {
            setLoading(true);
            const result = await complaintsService.getNearbyVerifications({ lat: 12.9234, lng: 77.5678 });
            setVerifications(result.verifications || []);
        } catch (error) {
            console.error('Error loading verifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (issueId, verdict) => {
        try {
            const result = await complaintsService.submitVerification(issueId, verdict);
            alert(result.message);
            
            // Remove verified issue from list
            setVerifications(prev => prev.filter(v => v.id !== issueId));
        } catch (error) {
            alert('Failed to submit verification');
        }
    };

    if (loading || verifications.length === 0) {
        return null;
    }

    return (
        <div style={{
            marginTop: '2rem',
            padding: '1.25rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            border: '2px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
            }}>
                <span style={{ fontSize: '1.5rem' }}>👥</span>
                <div>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#111827'
                    }}>
                        Help Verify Nearby Issues
                    </h3>
                    <p style={{
                        margin: 0,
                        fontSize: '0.75rem',
                        color: '#6B7280'
                    }}>
                        Earn +15 points for each verification
                    </p>
                </div>
            </div>

            {verifications.map(verification => (
                <div
                    key={verification.id}
                    style={{
                        padding: '1rem',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '0.5rem',
                        marginBottom: '0.75rem',
                        border: '1px solid #E5E7EB'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        marginBottom: '0.75rem'
                    }}>
                        {/* Photo Thumbnail */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '0.375rem',
                            overflow: 'hidden',
                            flexShrink: 0,
                            backgroundColor: '#E5E7EB'
                        }}>
                            <img
                                src={verification.photo}
                                alt={verification.category}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>

                        {/* Issue Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: '0.25rem'
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#6B7280'
                                }}>
                                    {verification.id}
                                </span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#10B981'
                                }}>
                                    📍 {verification.distance}
                                </span>
                            </div>
                            <h4 style={{
                                margin: '0 0 0.25rem 0',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                color: '#111827'
                            }}>
                                {verification.category}
                            </h4>
                            <p style={{
                                margin: 0,
                                fontSize: '0.75rem',
                                color: '#6B7280',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {verification.location}
                            </p>
                            <p style={{
                                margin: '0.25rem 0 0 0',
                                fontSize: '0.625rem',
                                color: '#9CA3AF'
                            }}>
                                {verification.verifications.current}/{verification.verifications.required} verified
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '0.5rem'
                    }}>
                        <button
                            onClick={() => handleVerify(verification.id, 'yes')}
                            style={{
                                padding: '0.625rem',
                                backgroundColor: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#065F46',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#D1FAE5';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ECFDF5';
                            }}
                        >
                            ✅ Yes, I See It
                        </button>
                        <button
                            onClick={() => handleVerify(verification.id, 'no')}
                            style={{
                                padding: '0.625rem',
                                backgroundColor: '#FEE2E2',
                                border: '1px solid #FECACA',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#991B1B',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#FECACA';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#FEE2E2';
                            }}
                        >
                            ❌ Not Here
                        </button>
                        <button
                            onClick={() => handleVerify(verification.id, 'unsure')}
                            style={{
                                padding: '0.625rem',
                                backgroundColor: '#F3F4F6',
                                border: '1px solid #D1D5DB',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#6B7280',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#E5E7EB';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#F3F4F6';
                            }}
                        >
                            🤷 Not Sure
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VerificationSection;
