/**
 * mediaUploadService.js
 * NILBx - Media Upload Service for Frontend
 *
 * Centralized service for handling media uploads (images, videos, documents)
 * Integrates with Media Upload Service (Port 8012)
 */

const MEDIA_UPLOAD_SERVICE_URL = 'http://localhost:8012';

/**
 * Media Upload Service
 * Handles file uploads with progress tracking, validation, and optimization
 */
class MediaUploadService {
  constructor() {
    this.activeUploads = new Map();
    this.uploadHistory = [];
    this.maxFileSize = 100 * 1024 * 1024; // 100 MB default
    this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    this.allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    this.allowedDocumentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
  }

  /**
   * Get authentication token
   * @returns {string|null} JWT token
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Get authorization headers
   * @returns {Object} Headers with auth token
   */
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // MARK: - File Validation

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateFile(file, options = {}) {
    const errors = [];

    // Check file exists
    if (!file) {
      return { valid: false, errors: ['No file provided'] };
    }

    // Check file size
    const maxSize = options.maxSize || this.maxFileSize;
    if (file.size > maxSize) {
      errors.push(`File size exceeds maximum of ${this.formatFileSize(maxSize)}`);
    }

    // Check file type
    const allowedTypes = options.allowedTypes || this.getAllowedTypes();
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Check file name
    if (options.validateFileName && !/^[a-zA-Z0-9-_. ]+$/.test(file.name)) {
      errors.push('File name contains invalid characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get all allowed file types
   * @returns {Array} Array of allowed MIME types
   */
  getAllowedTypes() {
    return [
      ...this.allowedImageTypes,
      ...this.allowedVideoTypes,
      ...this.allowedDocumentTypes
    ];
  }

  /**
   * Check if file is an image
   * @param {File} file - File to check
   * @returns {boolean} Whether file is an image
   */
  isImage(file) {
    return this.allowedImageTypes.includes(file.type);
  }

  /**
   * Check if file is a video
   * @param {File} file - File to check
   * @returns {boolean} Whether file is a video
   */
  isVideo(file) {
    return this.allowedVideoTypes.includes(file.type);
  }

  /**
   * Check if file is a document
   * @param {File} file - File to check
   * @returns {boolean} Whether file is a document
   */
  isDocument(file) {
    return this.allowedDocumentTypes.includes(file.type);
  }

  // MARK: - Image Processing

  /**
   * Compress image before upload
   * @param {File} file - Image file
   * @param {Object} options - Compression options
   * @returns {Promise<Blob>} Compressed image blob
   */
  async compressImage(file, options = {}) {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.85
    } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            quality
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Generate thumbnail for image
   * @param {File} file - Image file
   * @param {number} size - Thumbnail size (default 200x200)
   * @returns {Promise<Blob>} Thumbnail blob
   */
  async generateThumbnail(file, size = 200) {
    return this.compressImage(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.7
    });
  }

  // MARK: - Upload Operations

  /**
   * Upload a single file
   * @param {File} file - File to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload response
   */
  async uploadFile(file, options = {}) {
    const {
      category = 'general',
      relatedId = null,
      relatedType = null,
      compress = true,
      generateThumbnail = true,
      onProgress = null
    } = options;

    try {
      // Validate file
      const validation = this.validateFile(file, options);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Compress image if needed
      let fileToUpload = file;
      if (compress && this.isImage(file)) {
        fileToUpload = await this.compressImage(file);
        fileToUpload = new File([fileToUpload], file.name, { type: file.type });
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('category', category);
      if (relatedId) formData.append('related_id', relatedId);
      if (relatedType) formData.append('related_type', relatedType);
      formData.append('original_filename', file.name);
      formData.append('file_size', fileToUpload.size);
      formData.append('mime_type', file.type);

      // Generate thumbnail if requested
      if (generateThumbnail && this.isImage(file)) {
        const thumbnail = await this.generateThumbnail(file);
        formData.append('thumbnail', thumbnail, `thumb_${file.name}`);
      }

      // Create upload ID for tracking
      const uploadId = Date.now().toString();
      this.activeUploads.set(uploadId, {
        file: file.name,
        progress: 0,
        status: 'uploading'
      });

      // Upload with progress tracking
      const response = await this.uploadWithProgress(
        `${MEDIA_UPLOAD_SERVICE_URL}/upload`,
        formData,
        (progress) => {
          this.activeUploads.set(uploadId, {
            file: file.name,
            progress,
            status: 'uploading'
          });
          if (onProgress) onProgress(progress);
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Update upload status
      this.activeUploads.set(uploadId, {
        file: file.name,
        progress: 100,
        status: 'completed'
      });

      // Add to history
      this.uploadHistory.push({
        uploadId,
        filename: file.name,
        url: data.url,
        timestamp: Date.now()
      });

      // Clean up after 5 seconds
      setTimeout(() => this.activeUploads.delete(uploadId), 5000);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Upload file with progress tracking
   * @param {string} url - Upload URL
   * @param {FormData} formData - Form data
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Response>} Fetch response
   */
  uploadWithProgress(url, formData, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          statusText: xhr.statusText,
          json: () => Promise.resolve(JSON.parse(xhr.responseText))
        });
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

      xhr.open('POST', url);

      // Add auth headers
      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  /**
   * Upload multiple files
   * @param {Array<File>} files - Files to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload results
   */
  async uploadMultipleFiles(files, options = {}) {
    const results = {
      successful: [],
      failed: []
    };

    for (const file of files) {
      const result = await this.uploadFile(file, options);

      if (result.success) {
        results.successful.push({
          filename: file.name,
          data: result.data
        });
      } else {
        results.failed.push({
          filename: file.name,
          error: result.error
        });
      }
    }

    return {
      success: results.failed.length === 0,
      results
    };
  }

  /**
   * Upload file from URL
   * @param {string} url - File URL
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload response
   */
  async uploadFromUrl(url, options = {}) {
    try {
      const response = await fetch(`${MEDIA_UPLOAD_SERVICE_URL}/upload-from-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({
          url,
          ...options
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error uploading from URL:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Media Management

  /**
   * Get uploaded media files
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} List of media files
   */
  async getMediaFiles(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.relatedId) queryParams.append('related_id', filters.relatedId);
      if (filters.relatedType) queryParams.append('related_type', filters.relatedType);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.offset) queryParams.append('offset', filters.offset);

      const url = `${MEDIA_UPLOAD_SERVICE_URL}/media${
        queryParams.toString() ? `?${queryParams}` : ''
      }`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch media files: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching media files:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get media file by ID
   * @param {number} mediaId - Media ID
   * @returns {Promise<Object>} Media file details
   */
  async getMediaFile(mediaId) {
    try {
      const response = await fetch(`${MEDIA_UPLOAD_SERVICE_URL}/media/${mediaId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch media file: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching media file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete media file
   * @param {number} mediaId - Media ID
   * @returns {Promise<Object>} Response
   */
  async deleteMediaFile(mediaId) {
    try {
      const response = await fetch(`${MEDIA_UPLOAD_SERVICE_URL}/media/${mediaId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to delete media file: ${response.statusText}`);
      }

      return {
        success: true,
        message: 'Media file deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting media file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // MARK: - Helper Methods

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Get file extension
   * @param {string} filename - File name
   * @returns {string} File extension
   */
  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
  }

  /**
   * Get file icon based on type
   * @param {string} mimeType - MIME type
   * @returns {string} Icon name
   */
  getFileIcon(mimeType) {
    if (this.allowedImageTypes.includes(mimeType)) return 'image';
    if (this.allowedVideoTypes.includes(mimeType)) return 'video';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('word')) return 'document';
    return 'file';
  }

  /**
   * Get active uploads
   * @returns {Array} Active uploads
   */
  getActiveUploads() {
    return Array.from(this.activeUploads.entries()).map(([id, data]) => ({
      uploadId: id,
      ...data
    }));
  }

  /**
   * Get upload history
   * @param {number} limit - Maximum number of items
   * @returns {Array} Upload history
   */
  getUploadHistory(limit = 10) {
    return this.uploadHistory.slice(-limit).reverse();
  }

  /**
   * Clear upload history
   */
  clearUploadHistory() {
    this.uploadHistory = [];
  }

  /**
   * Cancel active upload
   * @param {string} uploadId - Upload ID
   */
  cancelUpload(uploadId) {
    if (this.activeUploads.has(uploadId)) {
      this.activeUploads.set(uploadId, {
        ...this.activeUploads.get(uploadId),
        status: 'cancelled'
      });
      // In a real implementation, you'd abort the XMLHttpRequest here
    }
  }
}

// Create and export singleton instance
const mediaUploadService = new MediaUploadService();

export default mediaUploadService;

// Export media categories
export const MediaCategories = {
  PROFILE_PICTURE: 'profile_picture',
  DELIVERABLE: 'deliverable',
  DEAL_ATTACHMENT: 'deal_attachment',
  PROOF_OF_WORK: 'proof_of_work',
  GENERAL: 'general',
  MARKETING_MATERIAL: 'marketing_material'
};

// Export file types
export const FileTypes = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  OTHER: 'other'
};
