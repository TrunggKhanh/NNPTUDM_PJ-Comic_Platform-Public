const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/user.model"); 
const KhachHang = require("../model/khachhang.model"); 
const Avatar = require("../model/Avatar.model");
const router = express.Router();

// API Đăng nhập khách hàng
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm User dựa trên UserName
    const user = await User.findOne({ UserName: username });
    if (!user) {
      return res.status(400).json({ success: false, message: "Tài khoản không tồn tại!" });
    }

    // So sánh mật khẩu
    const isPasswordCorrect = await bcrypt.compare(password, user.Password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Mật khẩu không đúng!" });
    }

    // Tìm thông tin KhachHang liên kết với User
    const khachHang = await KhachHang.findOne({ IdUser: user.IdUser });
    if (!khachHang) {
      return res.status(400).json({ success: false, message: "Không tìm thấy thông tin khách hàng!" });
    }

    // Kiểm tra trạng thái Premium
    if (khachHang.TicketSalary <= 0) {
      khachHang.ActivePremium = false;
      await khachHang.save();
    }

    // Tìm Avatar nếu có
    let avatarUrl = "/uploads/Avatar/100008-spy-x-family-anya-1.png"; 
    if (khachHang.IdAvatar) {
      const avatar = await Avatar.findById(khachHang.IdAvatar);
      if (avatar && avatar.AvatarContent) {
        avatarUrl = avatar.AvatarContent; 
      }
    }
    // Thiết lập session data để trả về
    const sessionData = {
      userName: user.UserName,
      userId: user.IdUser,
      activePremium: khachHang.ActivePremium,
    };

    // Thêm thông tin user và avatar
    const userResponse = {
      IdUser: user.IdUser,
      UserName: user.UserName,
      avatar: avatarUrl,
    };

    // Trả về phản hồi thành công
    res.status(200).json({ success: true, session: sessionData, user: userResponse });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ success: false, message: "Có lỗi xảy ra. Vui lòng thử lại sau." });
  }
});

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
