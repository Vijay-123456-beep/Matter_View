import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onFileUpload, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError('');
    
    if (!file.name.endsWith('.cif') && !file.name.endsWith('.CIF')) {
      setError('Please upload a CIF file (.cif or .CIF)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/parse-cif', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onFileUpload(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error parsing CIF file');
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="file-upload-container">
      <form
        className={`file-upload-form ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="file"
          id="file-upload"
          accept=".cif,.CIF"
          onChange={handleChange}
          disabled={loading}
        />
        <label
          htmlFor="file-upload"
          className="file-upload-label"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {loading ? (
            <div className="upload-loading">
              <div className="spinner"></div>
              <p>Processing CIF file...</p>
            </div>
          ) : (
            <div className="upload-content">
              <div className="upload-icon">📁</div>
              <p>
                <strong>Click to upload</strong> or drag and drop
              </p>
              <p>CIF files only (.cif, .CIF)</p>
            </div>
          )}
        </label>
      </form>
      
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
