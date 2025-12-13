import React, { useEffect } from 'react';
import { useCamera } from '../../hooks/useCamera';

const CameraCapture = ({ onCapture, onClose }) => {
    const { videoRef, isCameraActive, error, startCamera, stopCamera, capturePhoto } = useCamera();

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    const handleCapture = () => {
        const photoData = capturePhoto();
        if (photoData) {
            stopCamera();
            onCapture(photoData);
        }
    };

    const handleGalleryPick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    stopCamera();
                    onCapture(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    if (error) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', color: 'white', padding: '2rem' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</p>
                <h2 style={{ marginBottom: '0.5rem' }}>Camera Access Required</h2>
                <p style={{ color: '#9CA3AF', textAlign: 'center', marginBottom: '1.5rem' }}>{error}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={startCamera} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                        Try Again
                    </button>
                    <button onClick={handleGalleryPick} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                        Choose from Gallery
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000', zIndex: 1000 }}>
            {/* Header */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '1rem', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.125rem' }}>📸 Capture Issue</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleGalleryPick} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', cursor: 'pointer', fontSize: '1.25rem' }}>
                        🖼️
                    </button>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', cursor: 'pointer' }}>
                        ❌
                    </button>
                </div>
            </div>

            {/* Video Preview */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Capture Button */}
            {isCameraActive && (
                <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
                    <button
                        onClick={handleCapture}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            border: '4px solid white',
                            backgroundColor: 'rgba(16, 185, 129, 0.8)',
                            cursor: 'pointer',
                            fontSize: '2rem',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                        }}
                    >
                        📸
                    </button>
                </div>
            )}
        </div>
    );
};

export default CameraCapture;
