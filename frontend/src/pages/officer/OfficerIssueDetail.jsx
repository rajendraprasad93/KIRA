import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Calendar } from 'lucide-react';
import StatusTimeline from '../../components/StatusTimeline';
import MapComponent from '../../components/MapComponent';
import { mockIssues, mockWorkers } from '../../data/mock';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const OfficerIssueDetail = () => {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const issue = mockIssues.find(i => i.id === issueId) || mockIssues[0];
  const [status, setStatus] = useState(issue.status);
  const [notes, setNotes] = useState('');

  const getStatusBadge = (status) => {
    const statusMap = {
      reported: { text: 'Reported', class: 'badge-primary' },
      verifying: { text: 'Verifying', class: 'badge-warning' },
      assigned: { text: 'Assigned', class: 'badge-accent' },
      in_progress: { text: 'In Progress', class: 'badge-accent' },
      resolved: { text: 'Resolved', class: 'badge-success' },
      unverified: { text: 'Unverified', class: 'badge-error' }
    };
    const statusInfo = statusMap[status] || statusMap.reported;
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getSeverityBadge = (severity) => {
    const severityMap = {
      High: 'badge-error',
      Medium: 'badge-warning',
      Low: 'badge-primary'
    };
    return <span className={`badge ${severityMap[severity]}`}>{severity}</span>;
  };

  const handleStatusUpdate = (newStatus) => {
    setStatus(newStatus);
    const statusText = {
      reported: 'Reported',
      verifying: 'Verifying',
      assigned: 'Assigned',
      in_progress: 'In Progress',
      resolved: 'Resolved'
    }[newStatus];
    toast.success(`Status updated to: ${statusText}`);
  };

  const handleSaveNotes = () => {
    if (notes.trim()) {
      toast.success('Notes saved successfully');
    }
  };

  const getVerificationLabel = () => {
    if (issue.verifications.yes >= 3) {
      return {
        text: 'Highly Verified by Community',
        class: 'badge-success'
      };
    } else if (issue.verifications.no > issue.verifications.yes) {
      return {
        text: 'Needs Manual Inspection',
        class: 'badge-error'
      };
    } else if (issue.verifications.total === 0) {
      return {
        text: 'Awaiting Verification',
        class: 'badge-warning'
      };
    } else {
      return {
        text: 'Partially Verified',
        class: 'badge-warning'
      };
    }
  };

  const verificationLabel = getVerificationLabel();

  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <header 
        className="py-4 px-6 shadow-sm"
        style={{ backgroundColor: 'var(--bg-white)' }}
      >
        <div className="container flex items-center gap-4">
          <button 
            onClick={() => navigate('/officer/dashboard')}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" style={{ color: 'var(--primary)' }} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
            Issue Management
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <div className="card mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="mono-text text-2xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                  {issue.id}
                </p>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  {issue.categoryName}
                </p>
              </div>
              <div className="flex gap-2">
                {getSeverityBadge(issue.severity)}
                {getStatusBadge(status)}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Issue Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Citizen Description */}
              <div className="card">
                <h3 className="mb-3" style={{ color: 'var(--text-primary)' }}>Citizen Description</h3>
                <p style={{ color: 'var(--text-primary)' }}>{issue.description}</p>
              </div>

              {/* Location */}
              <div className="card">
                <h3 className="mb-3" style={{ color: 'var(--text-primary)' }}>Location</h3>
                <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin className="w-4 h-4" />
                  <span>{issue.location}</span>
                </div>
                <div className="h-64">
                  <MapComponent position={issue.coordinates} />
                </div>
              </div>

              {/* Photos */}
              {issue.photos && issue.photos.length > 0 && (
                <div className="card">
                  <h3 className="mb-3" style={{ color: 'var(--text-primary)' }}>Evidence Photos</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {issue.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Evidence ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Community Verification */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ color: 'var(--text-primary)' }}>Community Verification</h3>
                  <span className={`badge ${verificationLabel.class}`}>
                    {verificationLabel.text}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Confirmed</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-32 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: '#e0e0e0' }}
                      >
                        <div 
                          className="h-full"
                          style={{ 
                            width: `${(issue.verifications.yes / issue.verifications.total) * 100}%`,
                            backgroundColor: 'var(--success)'
                          }}
                        ></div>
                      </div>
                      <span className="font-semibold" style={{ color: 'var(--success)' }}>
                        {issue.verifications.yes}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Denied</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-32 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: '#e0e0e0' }}
                      >
                        <div 
                          className="h-full"
                          style={{ 
                            width: `${(issue.verifications.no / issue.verifications.total) * 100}%`,
                            backgroundColor: 'var(--error)'
                          }}
                        ></div>
                      </div>
                      <span className="font-semibold" style={{ color: 'var(--error)' }}>
                        {issue.verifications.no}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Not Sure</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-32 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: '#e0e0e0' }}
                      >
                        <div 
                          className="h-full"
                          style={{ 
                            width: `${(issue.verifications.notSure / issue.verifications.total) * 100}%`,
                            backgroundColor: 'var(--warning)'
                          }}
                        ></div>
                      </div>
                      <span className="font-semibold" style={{ color: 'var(--warning)' }}>
                        {issue.verifications.notSure}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <StatusTimeline 
                timeline={issue.timeline} 
                currentStatus={status === 'verifying' ? 'Being verified' : 
                             status === 'in_progress' ? 'In Progress' : 
                             status === 'resolved' ? 'Resolved' :
                             status === 'assigned' ? 'Assigned' : 'Reported'}
              />
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="card">
                <h3 className="mb-3" style={{ color: 'var(--text-primary)' }}>Issue Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Department</p>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {issue.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Reported By</p>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {issue.citizenName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Reported At</p>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {new Date(issue.reportedAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="card">
                <h3 className="mb-3" style={{ color: 'var(--text-primary)' }}>Update Status</h3>
                <Select value={status} onValueChange={handleStatusUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reported">Reported</SelectItem>
                    <SelectItem value="verifying">Verifying</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => handleStatusUpdate('in_progress')}
                    className="btn-accent w-full"
                  >
                    Mark as In Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('resolved')}
                    className="btn-primary w-full"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>

              {/* Worker Assignment (v2 Feature) */}
              <div className="card">
                <h3 className="mb-3" style={{ color: 'var(--text-primary)' }}>Assign Field Worker</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Current Worker</p>
                  {issue.assignedWorkerId ? (
                     <div className="flex items-center gap-2 font-semibold text-green-700 bg-green-50 p-2 rounded">
                        <Users className="w-4 h-4" />
                        {mockWorkers.find(w => w.id === issue.assignedWorkerId)?.name || issue.assignedWorkerId}
                     </div>
                  ) : (
                     <p className="text-sm italic text-gray-400">No worker assigned</p>
                  )}
                </div>

                <Select onValueChange={(val) => {
                    // Start assignment mock
                    issue.assignedWorkerId = val; // Mutate mock
                    issue.status = 'assigned';
                    setStatus('assigned');
                    toast.success('Worker assigned & Status updated');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a worker to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWorkers.map(worker => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.name} ({worker.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Internal Notes */}
              <div className="card">
                <h3 className="mb-3" style={{ color: 'var(--text-primary)' }}>Internal Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about actions taken..."
                  className="input-field mb-3"
                  rows="5"
                />
                <button
                  onClick={handleSaveNotes}
                  className="btn-primary w-full"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerIssueDetail;