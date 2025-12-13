// Mock AI Image Analysis Service
// In production, this would call Gemini Vision API or custom CV model

const MOCK_CATEGORIES = [
    {
        type: 'streetlight_not_working',
        displayName: 'Streetlight',
        icon: '💡',
        severity: 'high',
        description: 'LED bulb not glowing in dark alley'
    },
    {
        type: 'pothole',
        displayName: 'Pothole',
        icon: '🛣️',
        severity: 'medium',
        description: 'Road damage causing vehicle issues'
    },
    {
        type: 'drainage_overflow',
        displayName: 'Drainage',
        icon: '🚰',
        severity: 'high',
        description: 'Water overflow on street'
    },
    {
        type: 'garbage_overflow',
        displayName: 'Garbage',
        icon: '🗑️',
        severity: 'medium',
        description: 'Waste bin overflowing'
    }
];

export const analyzeImage = async (imageBase64, gpsLocation) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis - in production would call actual AI service
    const randomCategory = MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)];
    
    return {
        success: true,
        category: randomCategory.type,
        displayName: randomCategory.displayName,
        icon: randomCategory.icon,
        confidence: 0.94,
        severity: randomCategory.severity,
        description: randomCategory.description,
        duration_estimate: '5_days',
        safety_risk: randomCategory.severity === 'high' ? 'crime_accident_potential' : 'minor',
        location: gpsLocation || { lat: 12.9234, lng: 77.5678 },
        detectedText: 'Ward 12', // Mock OCR result
        metadata: {
            timestamp: new Date().toISOString(),
            imageQuality: 'good'
        }
    };
};

export const analyzeVoiceTranscript = async (transcript) => {
    // Simulate NLP processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple keyword matching (in production, use NLP)
    const lowerTranscript = transcript.toLowerCase();
    
    let category = 'other';
    let severity = 'medium';
    
    if (lowerTranscript.includes('light') || lowerTranscript.includes('streetlight')) {
        category = 'streetlight_not_working';
        severity = 'high';
    } else if (lowerTranscript.includes('pothole') || lowerTranscript.includes('road')) {
        category = 'pothole';
        severity = 'medium';
    } else if (lowerTranscript.includes('drainage') || lowerTranscript.includes('water')) {
        category = 'drainage_overflow';
        severity = 'high';
    } else if (lowerTranscript.includes('garbage') || lowerTranscript.includes('waste')) {
        category = 'garbage_overflow';
        severity = 'medium';
    }

    return {
        success: true,
        category,
        severity,
        extractedInfo: {
            issue: transcript,
            confidence: 0.85
        }
    };
};
