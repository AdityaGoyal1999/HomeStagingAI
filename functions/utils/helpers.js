const { FILE_UPLOAD } = require('./constants');

// Generate unique file path
const generateFilePath = (userId, originalName) => {
  const timestamp = Date.now();
  return `images/${userId}/${timestamp}-${originalName}`;
};

// Validate file type
const isValidFileType = (mimetype) => {
  return FILE_UPLOAD.ALLOWED_TYPES.includes(mimetype);
};

// Validate file size
const isValidFileSize = (size) => {
  return size <= FILE_UPLOAD.MAX_SIZE;
};

// Generate public URL
const generatePublicURL = (bucketName, filePath) => {
  return `https://storage.googleapis.com/${bucketName}/${filePath}`;
};

// Format error response
const formatErrorResponse = (message, statusCode = 500) => {
  return {
    error: message,
    statusCode
  };
};

// Format success response
const formatSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

module.exports = {
  generateFilePath,
  isValidFileType,
  isValidFileSize,
  generatePublicURL,
  formatErrorResponse,
  formatSuccessResponse
}; 