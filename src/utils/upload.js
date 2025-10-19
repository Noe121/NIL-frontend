/**
 * Enhanced file upload utility with chunked upload and retry support
 */

import { retryFetch } from './retry';

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
const MAX_CONCURRENT_CHUNKS = 3;

/**
 * Split file into chunks for upload
 */
const createChunks = (file, chunkSize = CHUNK_SIZE) => {
  const chunks = [];
  let start = 0;

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);
    chunks.push(file.slice(start, end));
    start = end;
  }

  return chunks;
};

/**
 * Upload a single chunk with retry support
 */
const uploadChunk = async (chunk, index, uploadId, endpoint, retryConfig) => {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('chunkIndex', index.toString());
  formData.append('uploadId', uploadId);

  try {
    const response = await retryFetch(endpoint, {
      method: 'POST',
      body: formData
    }, retryConfig);

    if (!response.ok) {
      throw new Error(`Chunk upload failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Chunk ${index} upload failed:`, error);
    throw error;
  }
};

/**
 * Initialize chunked upload
 */
const initializeUpload = async (fileName, fileSize, endpoint) => {
  try {
    const response = await retryFetch(`${endpoint}/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName,
        fileSize,
        chunkSize: CHUNK_SIZE
      })
    });

    if (!response.ok) {
      throw new Error('Failed to initialize upload');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload initialization failed:', error);
    throw error;
  }
};

/**
 * Complete chunked upload
 */
const completeUpload = async (uploadId, totalChunks, endpoint) => {
  try {
    const response = await retryFetch(`${endpoint}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uploadId,
        totalChunks
      })
    });

    if (!response.ok) {
      throw new Error('Failed to complete upload');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload completion failed:', error);
    throw error;
  }
};

/**
 * Upload file with chunking and retry support
 */
export const uploadFileWithRetry = async (file, endpoint, options = {}) => {
  const {
    onProgress,
    retryConfig = {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000
    }
  } = options;

  try {
    // Initialize upload
    const { uploadId } = await initializeUpload(file.name, file.size, endpoint);

    // Split file into chunks
    const chunks = createChunks(file);
    let uploadedChunks = 0;

    // Upload chunks with concurrency control
    const chunkResults = [];
    for (let i = 0; i < chunks.length; i += MAX_CONCURRENT_CHUNKS) {
      const chunkBatch = chunks.slice(i, i + MAX_CONCURRENT_CHUNKS);
      const batchPromises = chunkBatch.map((chunk, index) => 
        uploadChunk(chunk, i + index, uploadId, endpoint, retryConfig)
      );

      const results = await Promise.all(batchPromises);
      chunkResults.push(...results);

      uploadedChunks += chunkBatch.length;
      if (onProgress) {
        onProgress(Math.round((uploadedChunks / chunks.length) * 100));
      }
    }

    // Complete upload
    const result = await completeUpload(uploadId, chunks.length, endpoint);

    return {
      success: true,
      uploadId,
      result
    };
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

/**
 * Resume interrupted upload
 */
export const resumeUpload = async (uploadId, file, endpoint, options = {}) => {
  try {
    // Get status of existing chunks
    const statusResponse = await retryFetch(`${endpoint}/status/${uploadId}`);
    const { uploadedChunks } = await statusResponse.json();

    // Upload missing chunks
    const chunks = createChunks(file);
    const missingChunks = chunks.filter((_, index) => !uploadedChunks.includes(index));

    return await uploadFileWithRetry(
      new Blob(missingChunks),
      endpoint,
      {
        ...options,
        uploadId,
        startChunkIndex: uploadedChunks.length
      }
    );
  } catch (error) {
    console.error('Upload resume failed:', error);
    throw error;
  }
};