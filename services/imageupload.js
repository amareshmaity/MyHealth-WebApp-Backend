const multer = require('multer');
const path = require('path');



// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload with 100 KB file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000 }, // 100 KB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');


function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

module.exports = upload;
