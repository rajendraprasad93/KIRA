import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGPS } from '../../hooks/useGPS';
import { analyzeImage, analyzeVoiceTranscript } from '../../services/aiService';
import { submitComplaint } from '../../services/complaintService';
import CameraCapture from '../../components/ReportIssue/CameraCapture';
import AIResults from '../../components/ReportIssue/AIResults';
import VoiceRecorder from '../../components/ReportIssue/VoiceRecorder';
import PinDropMap from '../../components/ReportIssue/PinDropMap';
import ManualForm from '../../components/ReportIssue/ManualForm';
import ImageValidationStep from '../../components/ReportIssue/ImageValidationStep';

const ReportIssuePage = () => {
    const navigate = useNavigate();
    const { location, error: gpsError } = useGPS();
    
    const [currentStep, setCurrentStep] = useState('camera'); // 'camera' | 'validation' | 'ai_processing' | 'ai_results' | 'voice' | 'manual' | 'success'
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [submittedComplaint, setSubmittedComplaint] = useState(null);

    const handlePhotoCapture = async (photoData) => {
        setCapturedPhoto(photoData);
        // Go to validation step first
        setCurrentStep('validation');
    };

    const handleValidationComplete = async (result) => {
        setValidationResult(result);
        
        // If validation passed, proceed to AI analysis
        if (result.status === 'accepted') {
            setCurrentStep('ai_processing');
            setIsProcessing(true);

            try {
                // Simulate AI analysis
                const analysis = await analyzeImage(capturedPhoto, location);
                setAiAnalysis(analysis);
                setCurrentStep('ai_results');
            } catch (error) {
                console.error('AI Analysis failed:', error);
                // Fallback to manual form
                setCurrentStep('manual');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleVoiceTranscript = async (transcript) => {
        setIsProcessing(true);
        try {
            const analysis = await analyzeVoiceTranscript(transcript);
            // Merge voice analysis with existing or create new
            setAiAnalysis(prev => ({
                ...prev,
                ...analysis.extractedInfo,
                category: analysis.category,
                severity: analysis.severity,
                description: transcript,
                location: location || { lat: 12.9234, lng: 77.5678 }
            }));
            setCurrentStep('ai_results');
        } catch (error) {
            console.error('Voice analysis failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmitFromAI = async () => {
        setIsProcessing(true);
        try {
            const payload = {
                category: aiAnalysis.category,
                description: aiAnalysis.description,
                severity: aiAnalysis.severity,
                location: aiAnalysis.location,
                photoBase64: capturedPhoto,
                timestamp: new Date().toISOString()
            };

            const result = await submitComplaint(payload);
            setSubmittedComplaint(result);
            setCurrentStep('success');
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to submit complaint. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleManualSubmit = async (formData) => {
        setIsProcessing(true);
        try {
            const payload = {
                ...formData,
                location: location || { lat: 12.9234, lng: 77.5678 },
                photoBase64: capturedPhoto,
                timestamp: new Date().toISOString()
            };

            const result = await submitComplaint(payload);
            setSubmittedComplaint(result);
            setCurrentStep('success');
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to submit complaint. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Camera Step
    if (currentStep === 'camera') {
        return (
            <CameraCapture
                onCapture={handlePhotoCapture}
                onClose={() => navigate('/dashboard')}
            />
        );
    }

    // Validation Step
    if (currentStep === 'validation' && capturedPhoto) {
        return (
            <ImageValidationStep
                photoData={capturedPhoto}
                onValidationComplete={handleValidationComplete}
                onRetake={() => setCurrentStep('camera')}
            />
        );
    }

    // AI Processing Step
    if (currentStep === 'ai_processing') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', padding: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>✨</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Analyzing your photo...</h2>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>AI is detecting the issue type and severity</p>
                </div>
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // AI Results Step
    if (currentStep === 'ai_results' && aiAnalysis) {
        return (
            <AIResults
                analysis={aiAnalysis}
                onSubmit={handleSubmitFromAI}
                onRetake={() => setCurrentStep('camera')}
                onEdit={() => setCurrentStep('manual')}
            />
        );
    }

    // Voice Step
    if (currentStep === 'voice') {
        return (
            <VoiceRecorder
                onTranscriptComplete={handleVoiceTranscript}
            />
        );
    }

    // Manual Step
    if (currentStep === 'manual') {
        return (
            <ManualForm
                initialData={aiAnalysis}
                onSubmit={handleManualSubmit}
                onCancel={() => navigate('/dashboard')}
            />
        );
    }

    // Success Step
    if (currentStep === 'success' && submittedComplaint) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '450px', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Complaint Submitted!</h2>
                    
                    <div style={{ backgroundColor: '#ECFDF5', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.875rem', color: '#065F46', margin: 0 }}>
                            <strong>Complaint ID:</strong> {submittedComplaint.complaintId}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#065F46', margin: '0.25rem 0 0 0' }}>
                            <strong>Expected Fix:</strong> {submittedComplaint.expectedResolution}
                        </p>
                    </div>

                    {submittedComplaint.rewards && (
                        <div style={{ backgroundColor: '#FEF3C7', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#92400E', margin: '0 0 0.5rem 0' }}>🏆 Your Rewards</h3>
                            <p style={{ fontSize: '0.875rem', color: '#92400E', margin: 0 }}>
                                +{submittedComplaint.rewards.points} points
                            </p>
                            {submittedComplaint.rewards.badges && (
                                <p style={{ fontSize: '0.875rem', color: '#92400E', margin: '0.25rem 0 0 0' }}>
                                    Badges: {submittedComplaint.rewards.badges.join(', ')}
                                </p>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                backgroundColor: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            📱 Track Live: Open Dashboard
                        </button>
                        <button
                            onClick={() => {
                                setCapturedPhoto(null);
                                setAiAnalysis(null);
                                setSubmittedComplaint(null);
                                setCurrentStep('camera');
                            }}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                backgroundColor: 'white',
                                color: '#10B981',
                                border: '1px solid #10B981',
                                borderRadius: '0.375rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            🚀 Report Another Issue
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
            <p>Loading...</p>
        </div>
    );
};

export default ReportIssuePage;