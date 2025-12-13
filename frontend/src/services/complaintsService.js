// Complaints Service - Handles complaint tracking, timelines, and ratings

import { mockComplaints, nearbyVerifications, getComplaintsByStatus, getComplaintCounts } from '../data/mockComplaints';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get user's complaints with optional status filter
export const getUserComplaints = async (userId, statusFilter = 'all') => {
    await delay(500);
    
    try {
        // In production, this would be: GET /api/complaints/user/:userId?status=statusFilter
        const complaints = getComplaintsByStatus(statusFilter);
        return {
            success: true,
            complaints,
            counts: getComplaintCounts()
        };
    } catch (error) {
        console.error('Error fetching complaints:', error);
        throw new Error('Failed to fetch complaints');
    }
};

// Get detailed timeline for a specific complaint
export const getComplaintTimeline = async (complaintId) => {
    await delay(300);
    
    try {
        const complaint = mockComplaints.find(c => c.id === complaintId);
        if (!complaint) {
            throw new Error('Complaint not found');
        }
        
        return {
            success: true,
            timeline: complaint.timeline,
            resolutionTime: complaint.resolutionTime,
            avgResolutionTime: complaint.avgResolutionTime
        };
    } catch (error) {
        console.error('Error fetching timeline:', error);
        throw error;
    }
};

// Submit worker rating
export const submitRating = async (complaintId, ratingData) => {
    await delay(800);
    
    try {
        // In production: POST /api/complaints/:id/rate
        const complaint = mockComplaints.find(c => c.id === complaintId);
        if (!complaint) {
            throw new Error('Complaint not found');
        }
        
        // Calculate points based on rating quality
        let points = 10; // Base points for rating
        if (ratingData.overall === 5) points += 5;
        if (ratingData.feedback && ratingData.feedback.length > 0) points += 5;
        
        // Simulate successful submission
        complaint.rating = {
            ...ratingData,
            submittedAt: new Date().toISOString()
        };
        
        return {
            success: true,
            points,
            message: 'Thank you for your feedback!',
            nextReward: 'Rate 5 issues to unlock "Community Reviewer" badge'
        };
    } catch (error) {
        console.error('Error submitting rating:', error);
        throw new Error('Failed to submit rating');
    }
};

// Get nearby issues that need verification
export const getNearbyVerifications = async (location) => {
    await delay(400);
    
    try {
        // In production: GET /api/verification/nearby?lat=&lng=
        return {
            success: true,
            verifications: nearbyVerifications
        };
    } catch (error) {
        console.error('Error fetching verifications:', error);
        throw new Error('Failed to fetch verification requests');
    }
};

// Submit verification for a nearby issue
export const submitVerification = async (issueId, verdict) => {
    await delay(500);
    
    try {
        // In production: POST /api/verification/:issueId
        const verification = nearbyVerifications.find(v => v.id === issueId);
        if (!verification) {
            throw new Error('Issue not found');
        }
        
        let points = 0;
        let message = '';
        
        if (verdict === 'yes') {
            verification.verifications.current += 1;
            points = 15;
            message = `+${points} points! Issue verified successfully.`;
        } else if (verdict === 'no') {
            message = 'Thank you for your feedback.';
        } else {
            message = 'Marked as unsure.';
        }
        
        return {
            success: true,
            points,
            message,
            newCount: verification.verifications.current
        };
    } catch (error) {
        console.error('Error submitting verification:', error);
        throw new Error('Failed to submit verification');
    }
};

// Call worker (initiate phone call)
export const callWorker = (phoneNumber) => {
    // This would trigger a phone call in a mobile app
    // For web, we'll just log it
    console.log('Calling worker:', phoneNumber);
    window.location.href = `tel:${phoneNumber}`;
};

// Share complaint success on social media
export const shareComplaintSuccess = async (complaintId, platform = 'whatsapp') => {
    const complaint = mockComplaints.find(c => c.id === complaintId);
    if (!complaint) return;
    
    const message = `🎉 My complaint ${complaintId} was resolved in ${complaint.resolutionTime || 'record time'}! GrievanceGenie is making our city better! #SmartCity #CivicTech`;
    
    const shareUrls = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`
    };
    
    const url = shareUrls[platform] || shareUrls.whatsapp;
    window.open(url, '_blank');
    
    // Award points for sharing
    return {
        success: true,
        points: 10,
        message: '+10 points for sharing your success!'
    };
};

export default {
    getUserComplaints,
    getComplaintTimeline,
    submitRating,
    getNearbyVerifications,
    submitVerification,
    callWorker,
    shareComplaintSuccess
};
