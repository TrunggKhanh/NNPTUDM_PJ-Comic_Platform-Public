const express = require('express');
const User = require('../../model/user.model'); 
const Staff = require('../../model/Staff.model'); 
const router = express.Router();
const bcrypt = require("bcrypt");
const StaffPermissionsDetail = require('../../model/StaffPermissionsDetail.model');

// Router login cho quản lý
router.post('/login', async (req, res) => {
    const { UserName, Password } = req.body;

    try {
        // Kiểm tra người dùng trong database
        const user = await User.findOne({ UserName });
        if (!user) {
            console.log(`Name nhận được: ${UserName}`);
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }

        // So sánh mật khẩu và thêm log mật khẩu đã giải mã
        const isMatch = await bcrypt.compare(Password, user.Password);
        console.log(`Mật khẩu nhận được: ${Password}`);
        console.log(`Mật khẩu trong database (đã hash): ${user.Password}`);
        console.log(`Kết quả so sánh: ${isMatch}`);

        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng!" });
        }

        // Kiểm tra quyền UserRole
        if (!user.UserRole) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }
        if (!user.Active) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập do tài khoản đã bị khóa !!' });
        }
        // Kiểm tra quyền StaffRole trong bảng Staff
        const staff = await Staff.findOne({ userId: user._id }); // Xác thực bằng _id
        if (!staff || !staff.StaffRole) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập quản lý' });
        }

        const permissions = await StaffPermissionsDetail.find({ IdUser: user.IdUser }).select('IdPermissions Active');

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
            permissions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});


module.exports = router;
