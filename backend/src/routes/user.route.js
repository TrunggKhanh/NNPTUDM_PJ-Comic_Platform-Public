const express = require('express');
const User = require('../model/user.model'); // Import model User
const router = express.Router();

// Lấy thông tin người dùng
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ IdUser: id });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Route xóa tất cả người dùng
router.delete('/delete-all', async (req, res) => {
    try {
        // Xóa tất cả người dùng
        const result = await User.deleteMany({});
        
        // Phản hồi kết quả
        res.status(200).json({
            success: true,
            message: `Đã xóa ${result.deletedCount} tài khoản người dùng thành công.`,
        });
    } catch (error) {
        console.error('Error deleting all users:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa tất cả tài khoản người dùng.',
        });
    }
});

module.exports = router;
