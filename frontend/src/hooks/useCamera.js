import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef(null);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 1920, height: 1080 },
                audio: false
            });
            setStream(mediaStream);
            setIsCameraActive(true);
            setError(null);
            
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            setError('Camera access denied. Please enable camera permissions.');
            console.error('Camera error:', err);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsCameraActive(false);
        }
    }, [stream]);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current) return null;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
        
        return canvas.toDataURL('image/jpeg', 0.9);
    }, []);

    return {
        videoRef,
        stream,
        isCameraActive,
        error,
        startCamera,
        stopCamera,
        capturePhoto
    };
};
