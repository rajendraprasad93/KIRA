import React from 'react';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';

const VoiceRecorder = ({ onTranscriptComplete }) => {
    const { isRecording, transcript, error, startRecording, stopRecording, resetTranscript } = useVoiceRecording();

    const handleStart = () => {
        resetTranscript();
        startRecording();
    };

    const handleStop = () => {
        stopRecording();
        if (transcript) {
            onTranscriptComplete(transcript);
        }
    };

    return (
        <div style={{ padding: '1.5rem', backgroundColor: '#F3F4F6', minHeight: '50vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>🎤 Voice Report</h2>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Speak your complaint in any language</p>
            </div>

            {/* Mic Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={isRecording ? handleStop : handleStart}
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        border: isRecording ? '4px solid #EF4444' : '4px solid #10B981',
                        backgroundColor: isRecording ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        cursor: 'pointer',
                        fontSize: '3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                >
                    {isRecording ? '⏹️' : '🎤'}
                </button>
            </div>

            {/* Status */}
            {isRecording && (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#FEF2F2', borderRadius: '9999px', color: '#EF4444', fontSize: '0.875rem', fontWeight: '500' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', animation: 'blink 1s infinite' }}></span>
                        Listening...
                    </div>
                </div>
            )}

            {/* Transcript */}
            {transcript && (
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginBottom: '0.5rem' }}>Transcript:</h3>
                    <p style={{ color: '#111827', fontSize: '1rem', margin: 0 }}>{transcript}</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ backgroundColor: '#FEF2F2', borderRadius: '0.5rem', padding: '1rem', color: '#EF4444', fontSize: '0.875rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

export default VoiceRecorder;
