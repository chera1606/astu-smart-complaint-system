import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Define storage with filename sanitization
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        // Generate a unique, random name to prevent collisions and information disclosure
        const randomName = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${randomName}${ext}`);
    }
});

/**
 * Enhanced Check File Type
 * Validates both extension and actual MIME type
 */
function checkFileType(file, cb) {
    const allowedExtensions = /jpg|jpeg|png|pdf|doc|docx/;
    const allowedMimeTypes = /image\/jpeg|image\/png|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;

    const isExtensionAllowed = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const isMimeAllowed = allowedMimeTypes.test(file.mimetype);

    if (isExtensionAllowed && isMimeAllowed) {
        return cb(null, true);
    } else {
        cb(new Error('Security Error: Only Images (JPG, PNG) and Documents (PDF, DOC) are allowed!'));
    }
}

const upload = multer({
    storage,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Limit to 1 file per request for complaints
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

export default upload;
