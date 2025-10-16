import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenSize } from '../utils/responsive.jsx';
import { getAccessibilityProps } from '../utils/accessibility.jsx';
import Button from './Button.jsx';

const FileUpload = ({
  onFileSelect,
  onUpload,
  onProgress,
  onError,
  multiple = false,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  disabled = false,
  className = '',
  label,
  description,
  showPreview = true,
  allowDragDrop = true,
  autoUpload = false,
  uploadEndpoint,
  uploadHeaders = {},
  ...props
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  
  const fileInputRef = useRef(null);
  const { isMobile } = useScreenSize();

  // File validation
  const validateFile = (file) => {
    const errors = [];
    
    if (maxSize && file.size > maxSize) {
      errors.push(`File size exceeds ${formatBytes(maxSize)}`);
    }
    
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return type === fileExtension;
        }
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.slice(0, -1));
        }
        return type === fileType;
      });
      
      if (!isAccepted) {
        errors.push(`File type not accepted. Accepted types: ${accept}`);
      }
    }
    
    return errors;
  };

  // Format bytes for display
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFiles = useCallback((newFiles) => {
    if (disabled) return;

    const fileArray = Array.from(newFiles);
    const validFiles = [];
    const errors = [];

    // Check file count limit
    const totalFiles = files.length + fileArray.length;
    if (totalFiles > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      onError?.(errors);
      return;
    }

    // Validate each file
    fileArray.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        const fileWithId = {
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: 'pending', // pending, uploading, success, error
          preview: null,
          error: null
        };

        // Generate preview for images
        if (file.type.startsWith('image/') && showPreview) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFiles(prev => prev.map(f => 
              f.id === fileWithId.id 
                ? { ...f, preview: e.target.result }
                : f
            ));
          };
          reader.readAsDataURL(file);
        }

        validFiles.push(fileWithId);
      } else {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
      }
    });

    if (errors.length > 0) {
      onError?.(errors);
    }

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      onFileSelect?.(updatedFiles.map(f => f.file));

      if (autoUpload && uploadEndpoint) {
        validFiles.forEach(fileData => uploadFile(fileData));
      }
    }
  }, [files, multiple, maxFiles, maxSize, accept, disabled, onFileSelect, onError, autoUpload, uploadEndpoint, showPreview]);

  // Upload file
  const uploadFile = async (fileData) => {
    if (!uploadEndpoint) return;

    setUploading(true);
    setFiles(prev => prev.map(f => 
      f.id === fileData.id ? { ...f, status: 'uploading' } : f
    ));

    try {
      const formData = new FormData();
      formData.append('file', fileData.file);

      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(prev => ({ ...prev, [fileData.id]: progress }));
          setFiles(prev => prev.map(f => 
            f.id === fileData.id ? { ...f, progress } : f
          ));
          onProgress?.(fileData.id, progress);
        }
      };

      // Success handler
      xhr.onload = () => {
        if (xhr.status === 200) {
          setFiles(prev => prev.map(f => 
            f.id === fileData.id 
              ? { ...f, status: 'success', progress: 100 }
              : f
          ));
          onUpload?.(fileData, JSON.parse(xhr.responseText));
        } else {
          throw new Error(`Upload failed with status ${xhr.status}`);
        }
      };

      // Error handler
      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.open('POST', uploadEndpoint);
      
      // Add headers
      Object.entries(uploadHeaders).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.send(formData);

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileData.id 
          ? { ...f, status: 'error', error: error.message }
          : f
      ));
      onError?.([`${fileData.name}: ${error.message}`]);
    } finally {
      setUploading(false);
    }
  };

  // Remove file
  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const { [fileId]: removed, ...rest } = prev;
      return rest;
    });
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (allowDragDrop && !disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (allowDragDrop && !disabled) {
      setDragActive(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (allowDragDrop && !disabled && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Manual upload trigger
  const triggerUpload = () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    pendingFiles.forEach(fileData => uploadFile(fileData));
  };

  // Clear all files
  const clearFiles = () => {
    setFiles([]);
    setUploadProgress({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // File status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'uploading': return '📤';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📄';
    }
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : disabled
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${allowDragDrop && !disabled ? 'cursor-pointer' : ''}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
        {...getAccessibilityProps({
          role: 'button',
          tabIndex: disabled ? -1 : 0,
          ariaLabel: 'Click to select files or drag and drop files here',
          onKeyDown: (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }
        })}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          className="hidden"
        />

        <div className="text-center">
          <motion.div
            animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
            className="text-4xl mb-4"
          >
            📁
          </motion.div>
          
          <div className="text-lg font-medium text-gray-700 mb-2">
            {dragActive 
              ? 'Drop files here'
              : isMobile
                ? 'Tap to select files'
                : 'Click to select files or drag and drop'
            }
          </div>
          
          {description && (
            <p className="text-sm text-gray-500 mb-4">
              {description}
            </p>
          )}
          
          <div className="text-sm text-gray-500">
            {accept !== '*/*' && <div>Accepted types: {accept}</div>}
            {maxSize && <div>Max size: {formatBytes(maxSize)}</div>}
            {multiple && <div>Max files: {maxFiles}</div>}
          </div>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((fileData) => (
              <motion.div
                key={fileData.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* Preview or Icon */}
                <div className="flex-shrink-0">
                  {fileData.preview ? (
                    <img
                      src={fileData.preview}
                      alt={fileData.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-2xl">
                        {getStatusIcon(fileData.status)}
                      </span>
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {fileData.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatBytes(fileData.size)}
                  </div>
                  {fileData.error && (
                    <div className="text-sm text-red-600">
                      {fileData.error}
                    </div>
                  )}
                </div>

                {/* Progress */}
                {fileData.status === 'uploading' && (
                  <div className="flex-shrink-0 w-20">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${fileData.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-1">
                      {fileData.progress}%
                    </div>
                  </div>
                )}

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileData.id);
                  }}
                  className="text-red-600 hover:bg-red-50 min-w-[44px] min-h-[44px]"
                  icon="🗑️"
                  {...getAccessibilityProps({
                    ariaLabel: `Remove ${fileData.name}`
                  })}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {!autoUpload && uploadEndpoint && (
            <Button
              variant="primary"
              onClick={triggerUpload}
              disabled={uploading || files.every(f => f.status !== 'pending')}
              loading={uploading}
              icon="📤"
            >
              Upload Files
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={clearFiles}
            disabled={uploading}
            icon="🗑️"
          >
            Clear All
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;