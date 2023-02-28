const multer = require('multer');

// multer.diskStorage();

const storage = multer.memoryStorage();

// const upload = multer({ storage: {}, fileFilter: () => {} });
const upload = multer({ storage });

module.exports = { upload };
