const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/user.model"); // Import model User
const KhachHang = require("../model/khachhang.model"); // Import model KhachHang
const router = express.Router();

// Hàm tạo ID khách hàng
function generateCustomerId() {
  return `KH${Date.now()}`;
}
// API Đăng ký khách hàng
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ Email: email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email đã tồn tại!" });
    }

    // Tạo giao dịch (transaction)
    const session = await User.startSession();
    session.startTransaction();

    try {
      // Tạo User mới
      const newUser = new User({
        IdUser: generateCustomerId(),
        UserName: username.trim(),
        Password: password.trim(),
        Email: email.trim(),
        TimeCreated: new Date(),
        TimeUpdated: new Date(),
        Active: true,
        UserRole: false, 
      });

      await newUser.save({ session });

      // Tạo Khách Hàng mới liên kết với User
      const newKhachHang = new KhachHang({
        IdUser: newUser.IdUser,
        GoogleAccount: null,
        FacebookAccount: null,
        IdAvatar: null, 
        TicketSalary: 0,
        ActivePremium: false,
        ActiveStats: 1,
        SocialLogins: [],
        Payments: [],
      });

      await newKhachHang.save({ session });

      // Commit giao dịch
      await session.commitTransaction();
      session.endSession();

      // Phản hồi thành công, bao gồm thông tin người dùng
      res.status(201).json({
        success: true,
        message: "Đăng ký thành công!",
        user: {
          id: newUser.IdUser,
          username: newUser.UserName,
          email: newUser.Email,
          timeCreated: newUser.TimeCreated,
        },
      });
    } catch (err) {
      // Rollback nếu xảy ra lỗi
      await session.abortTransaction();
      session.endSession();
      console.error("Transaction error:", err);
      res.status(500).json({ success: false, message: "Có lỗi xảy ra trong quá trình đăng ký." });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
  }
});

module.exports = router;
