// Complaint Service - Handles submission to backend

export const submitComplaint = async (complaintData) => {
    try {
        // In production, this would POST to your backend API
        // For now, simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const complaintId = `GG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

        const response = {
            success: true,
            complaintId,
            status: 'pending',
            expectedResolution: '48 hours',
            verificationRequired: 8,
            rewards: {
                points: 25,
                badges: ['First Reporter', 'Civic Hero'],
                rankChange: { from: 5, to: 3 }
            }
        };

        // Optionally store in localStorage for demo
        const existingComplaints = JSON.parse(localStorage.getItem('userComplaints') || '[]');
        existingComplaints.push({
            id: complaintId,
            ...complaintData,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('userComplaints', JSON.stringify(existingComplaints));

        return response;
    } catch (error) {
        console.error('Error submitting complaint:', error);
        throw new Error('Failed to submit complaint. Please try again.');
    }
};

export const getComplaintById = async (complaintId) => {
    // Mock implementation
    const complaints = JSON.parse(localStorage.getItem('userComplaints') || '[]');
    return complaints.find(c => c.id === complaintId);
};
