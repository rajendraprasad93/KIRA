import { useState, useCallback, useRef } from 'react';

export const useVoiceRecording = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    const startRecording = useCallback(() => {
        // Check for Web Speech API support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            setError('Speech recognition not supported in this browser');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // Can be made dynamic

        recognition.onstart = () => {
            setIsRecording(true);
            setError(null);
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            setTranscript(finalTranscript || interimTranscript);
        };

        recognition.onerror = (event) => {
            setError(`Speech recognition error: ${event.error}`);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, []);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        isRecording,
        transcript,
        error,
        startRecording,
        stopRecording,
        resetTranscript
    };
};
