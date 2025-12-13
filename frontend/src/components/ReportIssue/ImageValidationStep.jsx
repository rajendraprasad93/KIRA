import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ImageValidationStep = ({ photoData, onValidationComplete, onRetake }) => {
    const [validationStatus, setValidationStatus] = useState('validating'); // 'validating', 'accepted', 'rejected'
    const [validationResult, setValidationResult] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const validationSteps = [
        { id: 1, label: '🤖 AI-generated detection', status: 'pending' },
        { id: 2, label: '📍 GPS & EXIF validation', status: 'pending' },
        { id: 3, label: '🔍 Duplicate check', status: 'pending' },
        { id: 4, label: '⚖️ Final decision', status: 'pending' }
    ];

    React.useEffect(() => {
        // Call real backend API for validation
        const runValidation = async () => {
            console.log('🔍 Starting image validation...');
            
            try {
                // Convert base64 to File object
                const base64Data = photoData.split(',')[1];
                const blob = await fetch(photoData).then(r => r.blob());
                const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
                
                console.log('📤 Sending image to backend for validation...');
                console.log('Image size:', (blob.size / 1024).toFixed(2), 'KB');

                // Prepare form data
                const formData = new FormData();
                formData.append('image', file);
                formData.append('issue_type', 'pothole'); // You can make this dynamic later
                // Add GPS if available (optional)
                // formData.append('latitude', '13.0827');
                // formData.append('longitude', '80.2707');

                // Animate through steps while waiting for response
                const stepInterval = setInterval(() => {
                    setCurrentStep(prev => {
                        if (prev < validationSteps.length) {
                            console.log(`✓ Step ${prev + 1}/${validationSteps.length}: ${validationSteps[prev].label}`);
                            return prev + 1;
                        }
                        return prev;
                    });
                }, 800);

                // Call backend API
                const API_BASE_URL = 'http://127.0.0.1:5000';
                console.log('🌐 API URL:', `${API_BASE_URL}/api/validate-image`);
                
                const response = await fetch(`${API_BASE_URL}/api/validate-image`, {
                    method: 'POST',
                    body: formData
                });

                clearInterval(stepInterval);
                setCurrentStep(validationSteps.length);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ API Error:', response.status, errorText);
                    throw new Error(`Validation failed: ${response.status}`);
                }

                const data = await response.json();
                console.log('✅ Validation response:', data);
                console.log('Status:', data.status);
                console.log('AI Score:', data.ai_generated_score);
                console.log('Confidence:', data.confidence_score);
                console.log('Reason Codes:', data.reason_codes);
                console.log('EXIF Status:', data.exif_status);

                // Process the result
                const result = {
                    status: data.status,
                    confidence: data.confidence_score,
                    ai_score: data.ai_generated_score,
                    has_gps: data.exif_status?.has_gps || false,
                    gps_address: data.exif_status?.gps_address || null,
                    gps_coordinates: data.exif_status?.gps_coordinates || null,
                    camera: data.exif_status?.camera_make && data.exif_status?.camera_model 
                        ? `${data.exif_status.camera_make} ${data.exif_status.camera_model}`
                        : null,
                    timestamp: data.exif_status?.timestamp || null,
                    warnings: data.reason_codes || [],
                    message: data.message,
                    full_exif: data.exif_status  // Store full EXIF for display
                };

                console.log('📊 Processed result:', result);

                setValidationResult(result);
                setValidationStatus(result.status);

                // Don't auto-proceed - wait for user to click Next
                if (result.status === 'accepted') {
                    console.log('✅ Image ACCEPTED - waiting for user to click Next');
                } else {
                    console.log('❌ Image REJECTED');
                    console.log('Rejection reason:', result.message);
                }

            } catch (error) {
                console.error('💥 Validation error:', error);
                console.error('Error details:', error.message);
                
                // Show error state
                setValidationStatus('error');
                setValidationResult({
                    status: 'error',
                    confidence: 0,
                    ai_score: 0,
                    has_gps: false,
                    warnings: [],
                    message: 'Validation failed. Please check if backend is running on port 5000.'
                });
            }
        };

        runValidation();
    }, []);

    const getStepIcon = (index) => {
        if (index < currentStep) {
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        } else if (index === currentStep) {
            return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
        } else {
            return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#F3F4F6',
            padding: '2rem'
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '500px', 
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    backgroundImage: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    {validationStatus === 'validating' && (
                        <>
                            <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
Validating Image
                            </h2>
                            <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>
                                Checking authenticity and preventing fraud...
                            </p>
                        </>
                    )}
                    {validationStatus === 'accepted' && (
                        <>
                            <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                ✓ Image Verified!
                            </h2>
                            <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>
                                Proceeding to AI analysis...
                            </p>
                        </>
                    )}
                    {validationStatus === 'rejected' && (
                        <>
                            <XCircle className="w-12 h-12 mx-auto mb-3" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                Image Rejected
                            </h2>
                            <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>
                                Please capture a new photo
                            </p>
                        </>
                    )}
                    {validationStatus === 'error' && (
                        <>
                            <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                Validation Error
                            </h2>
                            <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>
                                Could not connect to backend
                            </p>
                        </>
                    )}
                </div>

                {/* Photo Preview */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                    <img 
                        src={photoData} 
                        alt="Captured" 
                        style={{ 
                            width: '100%', 
                            height: '200px', 
                            objectFit: 'cover', 
                            borderRadius: '0.5rem' 
                        }} 
                    />
                </div>

                {/* Validation Steps */}
                <div style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        {validationSteps.map((step, index) => (
                            <div 
                                key={step.id}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '1rem',
                                    padding: '0.75rem',
                                    marginBottom: '0.5rem',
                                    backgroundColor: index === currentStep ? '#EFF6FF' : 'transparent',
                                    borderRadius: '0.5rem',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {getStepIcon(index)}
                                <span style={{ 
                                    color: index < currentStep ? '#10B981' : 
                                           index === currentStep ? '#3B82F6' : '#6B7280',
                                    fontWeight: index === currentStep ? '600' : '400'
                                }}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Results */}
                    {validationResult && (
                        <div style={{ 
                            padding: '1rem', 
                            backgroundColor: validationResult.status === 'accepted' ? '#ECFDF5' : '#FEF2F2',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            {/* Confidence Score */}
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                marginBottom: '0.75rem',
                                paddingBottom: '0.75rem',
                                borderBottom: '1px solid rgba(0,0,0,0.1)'
                            }}>
                                <span style={{ 
                                    color: validationResult.status === 'accepted' ? '#065F46' : '#991B1B',
                                    fontWeight: '600'
                                }}>
                                    Confidence Score
                                </span>
                                <span style={{ 
                                    color: validationResult.status === 'accepted' ? '#065F46' : '#991B1B',
                                    fontWeight: 'bold',
                                    fontSize: '1.125rem'
                                }}>
                                    {(validationResult.confidence * 100).toFixed(0)}%
                                </span>
                            </div>

                            {/* AI Score */}
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem'
                            }}>
                                <span style={{ color: '#6B7280' }}>🤖 AI Detection:</span>
                                <span style={{ 
                                    color: validationResult.ai_score > 0.5 ? '#DC2626' : '#059669',
                                    fontWeight: '600'
                                }}>
                                    {(validationResult.ai_score * 100).toFixed(1)}% AI
                                </span>
                            </div>

                            {/* GPS Status & Location */}
                            {validationResult.has_gps ? (
                                <div style={{ 
                                    marginBottom: '0.75rem',
                                    padding: '0.75rem',
                                    backgroundColor: '#F0FDF4',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #BBF7D0'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{ fontSize: '1.25rem' }}>📍</span>
                                        <span style={{ 
                                            color: '#059669',
                                            fontWeight: '600',
                                            fontSize: '0.875rem'
                                        }}>
                                            GPS Location Found
                                        </span>
                                    </div>
                                    {validationResult.gps_address && (
                                        <p style={{ 
                                            fontSize: '0.875rem', 
                                            color: '#047857',
                                            margin: '0 0 0.25rem 0',
                                            fontWeight: '500'
                                        }}>
                                            {validationResult.gps_address}
                                        </p>
                                    )}
                                    {validationResult.gps_coordinates && (
                                        <p style={{ 
                                            fontSize: '0.75rem', 
                                            color: '#6B7280',
                                            margin: 0,
                                            fontFamily: 'monospace'
                                        }}>
                                            {validationResult.gps_coordinates.latitude.toFixed(6)}°N, {validationResult.gps_coordinates.longitude.toFixed(6)}°E
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    marginBottom: '0.5rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <span style={{ color: '#6B7280' }}>📍 GPS Data:</span>
                                    <span style={{ 
                                        color: '#9CA3AF',
                                        fontWeight: '600'
                                    }}>
                                        ✗ Not Found
                                    </span>
                                </div>
                            )}

                            {/* Camera Info */}
                            {validationResult.camera && (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    marginBottom: '0.5rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <span style={{ color: '#6B7280' }}>📷 Camera:</span>
                                    <span style={{ 
                                        color: '#374151',
                                        fontWeight: '500',
                                        maxWidth: '60%',
                                        textAlign: 'right'
                                    }}>
                                        {validationResult.camera}
                                    </span>
                                </div>
                            )}

                            {/* Timestamp */}
                            {validationResult.timestamp && (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    marginBottom: '0.5rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <span style={{ color: '#6B7280' }}>🕒 Taken:</span>
                                    <span style={{ 
                                        color: '#374151',
                                        fontWeight: '500'
                                    }}>
                                        {new Date(validationResult.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {/* Warnings */}
                            {validationResult.warnings && validationResult.warnings.length > 0 && (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'start', 
                                    gap: '0.5rem',
                                    marginTop: '0.75rem',
                                    padding: '0.75rem',
                                    backgroundColor: '#FEF3C7',
                                    borderRadius: '0.375rem'
                                }}>
                                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p style={{ 
                                            fontSize: '0.75rem', 
                                            color: '#92400E', 
                                            margin: 0,
                                            fontWeight: '600'
                                        }}>
                                            Warning
                                        </p>
                                        <p style={{ 
                                            fontSize: '0.75rem', 
                                            color: '#92400E', 
                                            margin: '0.25rem 0 0 0' 
                                        }}>
                                            {validationResult.warnings.join(', ').replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    {validationStatus === 'accepted' && (
                        <button
                            onClick={() => onValidationComplete(validationResult)}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                backgroundColor: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            ✓ Continue to AI Analysis
                        </button>
                    )}

                    {validationStatus === 'rejected' && (
                        <button
                            onClick={onRetake}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                backgroundColor: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            📸 Retake Photo
                        </button>
                    )}

                    {validationStatus === 'error' && (
                        <div className="space-y-2">
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#FEE2E2',
                                borderRadius: '0.375rem',
                                marginBottom: '1rem'
                            }}>
                                <p style={{ fontSize: '0.875rem', color: '#991B1B', margin: 0 }}>
                                    ⚠️ Make sure your backend server is running on port 5000
                                </p>
                            </div>
                            <button
                                onClick={onRetake}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    backgroundColor: '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                📸 Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageValidationStep;
