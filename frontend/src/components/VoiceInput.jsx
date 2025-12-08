import React, { useState, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import { toast } from 'sonner';

const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Speech recognition error. Please try again.');
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (transcript) {
          onTranscript(transcript);
        }
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      recognition.start();
      setIsListening(true);
      toast.info('Listening... Speak clearly');
    } else {
      toast.error('Speech recognition is not supported in this browser. Please use Chrome.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      if (transcript) {
        onTranscript(transcript);
        toast.success('Voice input captured');
      }
    }
  };

  return (
    <div className="card">
      <div className="flex flex-col items-center justify-center py-8">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
          }`}
          style={{
            boxShadow: isListening 
              ? '0 0 0 0 rgba(239, 68, 68, 0.7)' 
              : '0 4px 12px rgba(0, 61, 130, 0.3)'
          }}
        >
          {isListening ? (
            <Square className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>
        <p className="mt-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {isListening ? 'Listening...' : 'Press to speak'}
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {isListening ? 'Tap again to stop' : 'Describe the civic issue in your own words'}
        </p>
        
        {isListening && transcript && (
          <div className="mt-6 w-full">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Live Transcript:</p>
              <p className="text-sm text-blue-800">{transcript}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;