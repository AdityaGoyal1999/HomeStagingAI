// File upload constants
const FILE_UPLOAD = {
  MAX_SIZE: 15 * 1024 * 1024, // 15MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  STORAGE_BUCKET: "homestaging-3aeee.firebasestorage.app"
};

// Photo types
const PHOTO_TYPES = {
  USER: 'user',
  GENERATED: 'generated'
};

// Allowed styles (keep in sync with frontend `roomStyles` values)
const ALLOWED_STYLES = [
  'minimalist',
  'scandinavian',
  'modern',
  'bohemian',
  'vintage',
  'industrial',
  'rustic',
  'coastal',
  'tropical',
  'mid-century-modern',
];

// HTTP Status codes
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  FILE_UPLOAD,
  PHOTO_TYPES,
  ALLOWED_STYLES,
  STATUS_CODES
}; 