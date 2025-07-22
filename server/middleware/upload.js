const multer = require('multer');
const path = require('path');

// Storage for profile photos
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profiles/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
});

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resumes/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype);
  cb(null, isValid);
};

const resumeFilter = (req, file, cb) => {
  const allowedTypes = /pdf|docx/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype);
  cb(null, isValid);
};

const uploadProfilePic = multer({ storage: profileStorage, fileFilter: imageFilter });
const uploadResume = multer({ storage: resumeStorage, fileFilter: resumeFilter });

module.exports = {
  uploadProfilePic,
  uploadResume
};
