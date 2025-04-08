const express = require('express');
const router = express.Router();
const User = require('../../model/user.model'); 
const Staff = require('../../model/Staff.model'); 
const bcrypt = require("bcrypt");

function generateStaffId() {
    return `ST${Date.now()}`;
  }
  
  // API thêm nhân viên
  router.post("/add-mod", async (req, res) => {
    const { username, email, password, fullName, phone, birth, gender } = req.body;
  
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
          IdUser: generateStaffId(),
          UserName: username.trim(),
          Password: password.trim(),
          FullName: fullName.trim(),
          Email: email.trim(),
          Phone: phone.trim(),
          Birth: birth ? new Date(birth) : null,
          Gender: gender,
          TimeCreated: new Date(),
          TimeUpdated: new Date(),
          Active: true,
          UserRole: true, // Đánh dấu là nhân viên
        });
  
        await newUser.save({ session });
  
        // Tạo Staff mới liên kết với User
        const newStaff = new Staff({
          userId: newUser._id, // Liên kết tới User
          StaffRole: true, // Vai trò nhân viên
        });
  
        await newStaff.save({ session });
  
        // Commit giao dịch
        await session.commitTransaction();
        session.endSession();
  
        // Phản hồi thành công
        res.status(201).json({
          success: true,
          message: "Thêm nhân viên thành công!",
          staff: {
            id: newUser.IdUser,
            username: newUser.UserName,
            email: newUser.Email,
            fullName: newUser.FullName,
            phone: newUser.Phone,
            role: "Staff",
            timeCreated: newUser.TimeCreated,
          },
        });
      } catch (err) {
        // Rollback nếu xảy ra lỗi
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction error:", err);
        res.status(500).json({ success: false, message: "Có lỗi xảy ra trong quá trình thêm nhân viên." });
      }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
    }
  });
  // Lấy danh sách nhân viên
  router.get("/", async (req, res) => {
    try {
        const staffs = await Staff.find().populate({
            path: "userId",
            select: "UserName Email Active FullName", // Chỉ lấy các trường cần thiết
        });

        const formattedStaffs = staffs.map((staff) => ({
            id: staff._id,
            userId: staff.userId._id,
            username: staff.userId.UserName,
            email: staff.userId.Email,
            active: staff.userId.Active,
            fullName: staff.userId.FullName,
            staffRole: staff.StaffRole,
        }));

        res.status(200).json(formattedStaffs);
    } catch (err) {
        console.error("Error fetching staff list:", err);
        res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên" });
    }
});
// Xóa nhân viên
router.delete("/:id", async (req, res) => {
    try {
        const staffId = req.params.id;
        const staff = await Staff.findByIdAndDelete(staffId);

        if (!staff) {
            return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }

        res.status(200).json({ message: "Xóa nhân viên thành công" });
    } catch (err) {
        console.error("Error deleting staff:", err);
        res.status(500).json({ message: "Lỗi khi xóa nhân viên" });
    }
});

router.put("/:id/toggle-active", async (req, res) => {
    try {
        const staffId = req.params.id;
        const staff = await Staff.findById(staffId).populate("userId");

        if (!staff) {
            return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }

        const user = await User.findById(staff.userId._id);
        user.Active = !user.Active;
        await user.save();

        res.status(200).json({ message: "Trạng thái đã được thay đổi", active: user.Active });
    } catch (err) {
        console.error("Error toggling staff active status:", err);
        res.status(500).json({ message: "Lỗi khi thay đổi trạng thái nhân viên" });
    }
});


// Thay đổi trạng thái hoạt động
router.put("/:id/toggle-active", async (req, res) => {
    try {
        const staffId = req.params.id;
        const staff = await Staff.findById(staffId);

        if (!staff) {
            return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }

        staff.active = !staff.active;
        staff.updatedAt = new Date();
        await staff.save();

        res.status(200).json({ message: "Thay đổi trạng thái thành công", staff });
    } catch (err) {
        console.error("Error toggling staff active status:", err);
        res.status(500).json({ message: "Lỗi khi thay đổi trạng thái nhân viên" });
    }
});
module.exports = router;
