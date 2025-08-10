const validateFileUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.files[0];
  
  // Check file size (15MB limit)
  const maxSize = 15 * 1024 * 1024; // 15MB
  if (file.size > maxSize) {
    return res.status(400).json({ error: "File size too large. Maximum size is 15MB" });
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" });
  }

  next();
};

const validateStyle = (req, res, next) => {
  if (!req.body.style) {
    return res.status(400).json({ error: "Style is required" });
  }

  // Validate style against allowed values
  const { ALLOWED_STYLES } = require('../utils/constants');
  if (!ALLOWED_STYLES.includes(req.body.style)) {
    return res.status(400).json({ error: "Invalid style selected" });
  }

  next();
};

module.exports = {
  validateFileUpload,
  validateStyle
}; 