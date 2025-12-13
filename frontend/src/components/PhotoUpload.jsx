import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, XCircle, Loader2, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '../services/api';

const PhotoUpload = ({ issueId, onPhotosChange, onValidationComplete }) => {
  const [photos, setPhotos] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + photos.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

   // Initialize photos with pending status
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      validationStatus: 'pending',
      validationMessage: 'Waiting to validate...',
      confidence: null,
      warnings: [],
      url: null
    }));

    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);

    // If issueId is provided, validate immediately
    if (issueId) {
      await validatePhotos(files, updatedPhotos.length - files.length);
    } else {
      // Otherwise just pass to parent for later validation
      if (onPhotosChange) {
        onPhotosChange(updatedPhotos);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validatePhotos = async (filesToValidate, startIndex) => {
    setIsValidating(true);

    try {
      // Mark photos as validating
      filesToValidate.forEach((_, index) => {
        const photoIndex = startIndex +index;
        setPhotos(prev => {
          const updated = [...prev];
          updated[photoIndex] = {
            ...updated[photoIndex],
            validationStatus: 'validating',
            validationMessage: 'Checking authenticity...'
          };
          return updated;
        });
      });

      // Call API to upload and validate
      const response = await apiService.uploadPhotos(issueId, filesToValidate);

      // Process validation results
      if (response.validation_results) {
        response.validation_results.forEach((result, index) => {
          const photoIndex = startIndex + index;
          
          setPhotos(prev => {
            const updated = [...prev];
            const photo = updated[photoIndex];
            
            if (result.status === 'accepted') {
              updated[photoIndex] = {
                ...photo,
                validationStatus: 'accepted',
                validationMessage: '✓ Image verified as authentic',
                confidence: result.confidence_score,
                warnings: result.warnings || [],
                url: result.url
              };
              toast.success(`${photo.name} validated successfully!`);
            } else if (result.status === 'rejected') {
              updated[photoIndex] = {
                ...photo,
                validationStatus: 'rejected',
                validationMessage: result.reason || '✗ Validation failed',
                confidence: result.details?.confidence_score || 0,
                warnings: result.details?.reason_codes || []
              };
              toast.error(`${photo.name} rejected: ${result.reason}`);
            } else {
              updated[photoIndex] = {
                ...photo,
                validationStatus: 'error',
                validationMessage: result.reason || 'Validation error',
                confidence: null,
                warnings: []
              };
              toast.error(`Error validating ${photo.name}`);
            }
            
            return updated;
          });
        });
      }

      // Notify parent of completion
      if (onValidationComplete) {
        onValidationComplete(response);
      }

    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to validate photos. Please try again.');
      
      // Mark all as error
      filesToValidate.forEach((_, index) => {
        const photoIndex = startIndex + index;
        setPhotos(prev => {
          const updated = [...prev];
          updated[photoIndex] = {
            ...updated[photoIndex],
            validationStatus: 'error',
            validationMessage: 'Validation failed',
            confidence: null,
            warnings: []
          };
          return updated;
        });
      });
    } finally {
      setIsValidating(false);
    }
  };

  const removePhoto = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    if (onPhotosChange) {
      onPhotosChange(updatedPhotos);
    }
  };

  const getValidationIcon = (status) => {
    switch (status) {
      case 'validating':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getValidationText = (photo) => {
    return photo.validationMessage || 'Pending validation';
  };

  const getValidationSteps = () => {
    return [
      '🤖 AI-generated detection...',
      '📍 GPS & EXIF validation...',
      '🔍 Duplicate check...',
      '⚖️ Final decision...'
    ];
  };

  return (
    <div className="card">
      <h3 className="mb-4" style={{ color: 'var(--text-primary)' }}>Add Photos</h3>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Upload photos to help officials understand the issue better (max 5)
      </p>
      
      <input
        ref={fileInputRef}
        type="file"
        id="photo-upload"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={isValidating}
      />
      
      <label
        htmlFor="photo-upload"
        className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed rounded-md transition-colors ${isValidating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-opacity-10'}`}
        style={{ 
          borderColor: 'var(--primary)',
          color: 'var(--primary)'
        }}
      >
        <Upload className="w-5 h-5" />
        <span className="font-semibold">
          {isValidating ? 'Validating...' : 'Choose Photos'}
        </span>
      </label>

      {photos.length > 0 && (
        <div className="space-y-3 mt-4">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className="relative border rounded-lg p-3 transition-all"
              style={{
                borderColor: photo.validationStatus === 'accepted' ? '#10b981' :
                            photo.validationStatus === 'rejected' ? '#ef4444' :
                            photo.validationStatus === 'validating' ? '#3b82f6' :
                            photo.validationStatus === 'error' ? '#f97316' :
                            'var(--border-color)',
                backgroundColor: 'var(--card-background)'
              }}
            >
              <div className="flex items-start gap-3">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <img
                    src={photo.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>

                {/* Validation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getValidationIcon(photo.validationStatus)}
                    <span className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {photo.name}
                    </span>
                  </div>

                  <div className="text-sm mb-1" style={{ 
                    color: photo.validationStatus === 'accepted' ? '#10b981' :
                           photo.validationStatus === 'rejected' ? '#ef4444' :
                           photo.validationStatus === 'validating' ? '#3b82f6' :
                           photo.validationStatus === 'error' ? '#f97316' :
                           'var(--text-secondary)'
                  }}>
                    {getValidationText(photo)}
                  </div>

                  {/* Validation Progress */}
                  {photo.validationStatus === 'validating' && (
                    <div className="space-y-1 mt-2">
                      {getValidationSteps().map((step, i) => (
                        <div key={i} className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                          <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
                          {step}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Confidence Score */}
                  {photo.validationStatus === 'accepted' && photo.confidence && (
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Confidence: {(photo.confidence * 100).toFixed(0)}%
                    </div>
                  )}

                  {/* Warnings */}
                  {photo.warnings && photo.warnings.length > 0 && (
                    <div className="flex items-start gap-1 mt-1 text-xs text-yellow-600">
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{photo.warnings.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-red-100 transition-colors"
                  disabled={photo.validationStatus === 'validating'}
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;