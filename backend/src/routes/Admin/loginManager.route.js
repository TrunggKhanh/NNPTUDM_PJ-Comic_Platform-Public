const express = require('express');
const User = require('../../model/user.model'); 
const Staff = require('../../model/Staff.model'); 
const router = express.Router();

// Router login cho quản lý
router.post('/login-admin', async (req, res) => {
    const { UserName, Password } = req.body;

    try {
        // Kiểm tra người dùng trong database
        const user = await User.findOne({ UserName });
        if (!user) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }

        // So sánh mật khẩu
        const isMatch = await user.comparePassword(Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu không chính xác' });
        }

        // Kiểm tra quyền UserRole
        if (!user.UserRole) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        // Kiểm tra quyền StaffRole trong bảng Staff
        const staff = await Staff.findOne({ IdUser: user.IdUser });
        if (!staff || !staff.StaffRole) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập quản lý' });
        }

        // Trả về thông tin đăng nhập thành công
        res.status(200).json({
            message: 'Đăng nhập thành công',
            data: {
                IdUser: user.IdUser,
                UserName: user.UserName,
                FullName: user.FullName,
                Email: user.Email,
                StaffRole: staff.StaffRole,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});

module.exports = router;
