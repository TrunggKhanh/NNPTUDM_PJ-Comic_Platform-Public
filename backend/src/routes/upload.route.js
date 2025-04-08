const express = require('express');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

// API upload file
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        const filePath = `/uploads/${req.file.filename}`; // Đường dẫn file
        res.status(201).json({
            message: 'Upload thành công',
            path: filePath
        });
    } catch (error) {
        console.error('Lỗi khi upload:', error);
        res.status(500).json({ message: 'Lỗi khi upload ảnh' });
    }
});

module.exports = router;
