import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const PhotoUpload = ({ onPhotosChange }) => {
  const [photos, setPhotos] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + photos.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
    toast.success(`${files.length} photo(s) added`);
  };

  const removePhoto = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
  };

  return (
    <div className="card">
      <h3 className="mb-4" style={{ color: 'var(--text-primary)' }}>Add Photos</h3>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Upload photos to help officials understand the issue better (max 5)
      </p>
      
      <input
        type="file"
        id="photo-upload"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      
      <label
        htmlFor="photo-upload"
        className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed rounded-md cursor-pointer transition-colors"
        style={{ 
          borderColor: 'var(--primary)',
          color: 'var(--primary)'
        }}
      >
        <Upload className="w-5 h-5" />
        <span className="font-semibold">Choose Photos</span>
      </label>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo.preview}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;