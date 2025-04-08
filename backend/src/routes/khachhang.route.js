const express = require("express");
const KhachHang = require("../model/khachhang.model");
const User = require("../model/user.model"); 
const Avatar = require("../model/Avatar.model"); 
const CTBoTruyen = require("../model/CTBoTruyen.model"); 
const router = express.Router();
const mongoose = require("mongoose");


// Tạo mới một khách hàng
router.post("/create", async (req, res) => {
    const {
        IdUser,
        GoogleAccount,
        FacebookAccount,
        IdAvatar,
        TicketSalary,
        ActivePremium,
        ActiveStats,
        SocialLogins,
        Payments,
    } = req.body;

    try {
        // Kiểm tra người dùng có tồn tại
        const user = await User.findById(IdUser);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        // Tạo khách hàng mới
        const khachHang = new KhachHang({
            IdUser,
            GoogleAccount,
            FacebookAccount,
            IdAvatar,
            TicketSalary,
            ActivePremium,
            ActiveStats,
            SocialLogins,
            Payments,
        });

        await khachHang.save();
        res.status(201).json({ message: "Tạo khách hàng thành công", khachHang });
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ message: "Lỗi khi tạo khách hàng" });
    }
});

// Cập nhật thông tin khách hàng và người dùng
router.put("/update", async (req, res) => {
    const { idUser, fullName, birthDate, gender, idAvatar } = req.body;
  
    if (!idUser) {
      return res.status(400).json({ success: false, message: "User ID is required!" });
    }
  
    try {
      // Truy vấn và cập nhật bằng `IdUser`
      const updatedCustomer = await KhachHang.findOneAndUpdate(
        { IdUser: idUser }, // Sử dụng IdUser
        { IdAvatar: idAvatar },
        { new: true }
      );
  
      if (!updatedCustomer) {
        return res.status(404).json({ success: false, message: "Customer not found!" });
      }
  
      const updatedUser = await User.findOneAndUpdate(
        { IdUser: idUser }, // Sử dụng IdUser
        {
          FullName: fullName,
          Birth: birthDate,
          Gender: gender,
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found!" });
      }
  
      res.status(200).json({
        success: true,
        message: "Customer and User updated successfully.",
        updatedCustomer,
        updatedUser,
      });
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({
        success: false,
        message: "Error updating customer and user.",
      });
    }
});
  
router.get("/read-history/:userId", async (req, res) => {
    try {
        const { userId } = req.params; // Lấy userId từ params

        // Kiểm tra đầu vào
        if (!userId) {
            return res.status(400).json({ message: "Thiếu thông tin userId" });
        }

        // Tìm tất cả CTBoTruyen dựa vào userId và ls_moi != null, populate thông tin BoTruyen
        const readHistory = await CTBoTruyen.find({
            user: userId,
            ls_moi: { $ne: null }, // Điều kiện ls_moi khác null
        }).populate({
            path: "bo_truyen", // Populate thông tin BoTruyen
            select: "tenbo poster danhgia theodoi trangthai", // Chọn các trường cần thiết
        });

        // Lọc bỏ các bản ghi không có thông tin BoTruyen hợp lệ
        const validReadHistory = readHistory.filter(item => item.bo_truyen);

        // Trả về danh sách bộ truyện
        const result = validReadHistory.map(item => ({
            id: item.bo_truyen._id,       // ID của bộ truyện
            tenbo: item.bo_truyen.tenbo,  // Tên bộ truyện
            poster: item.bo_truyen.poster, // Ảnh bìa
            danhgia: item.bo_truyen.danhgia, // Đánh giá
            theodoi: item.bo_truyen.theodoi, // Lượt theo dõi
            trangthai: item.bo_truyen.trangthai, // Trạng thái bộ truyện
            ls_moi: item.ls_moi,          // Lịch sử đọc mới nhất từ CTBoTruyen
        }));

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching read history:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bộ truyện đã đọc" });
    }
});
// Route cập nhật ls_moi thành null để xóa lịch sử đọc
router.post("/delete-read-history", async (req, res) => {
  try {
      const { userId, comicId } = req.body; // Nhận userId và comicId từ body

      // Kiểm tra đầu vào
      if (!userId || !comicId) {
          return res.status(400).json({ message: "Thiếu thông tin userId hoặc comicId" });
      }

      // Tìm bản ghi và cập nhật ls_moi thành null
      const updatedRecord = await CTBoTruyen.findOneAndUpdate(
          { user: userId, bo_truyen: comicId }, // Điều kiện tìm kiếm
          { ls_moi: null },                    // Cập nhật ls_moi thành null
          { new: true }                        // Trả về bản ghi đã cập nhật
      );

      // Kiểm tra nếu không tìm thấy bản ghi
      if (!updatedRecord) {
          return res.status(404).json({ message: "Không tìm thấy lịch sử đọc để xóa" });
      }

      res.status(200).json({
          success: true,
          message: "Lịch sử đọc đã được xóa thành công",
          data: updatedRecord,
      });
  } catch (error) {
      console.error("Error deleting read history:", error);
      res.status(500).json({ message: "Lỗi khi xóa lịch sử đọc" });
  }
});

router.get("/following/:userId", async (req, res) => {
  try {
      const { userId } = req.params; // Lấy userId từ params

      // Kiểm tra đầu vào
      if (!userId) {
          return res.status(400).json({ message: "Thiếu thông tin userId" });
      }

      // Tìm tất cả CTBoTruyen dựa vào userId và theodoi = true, populate thông tin BoTruyen
      const followingList = await CTBoTruyen.find({
          user: userId,
          theodoi: true, // Điều kiện theo dõi
      }).populate({
          path: "bo_truyen", // Populate thông tin BoTruyen
          select: "tenbo poster danhgia theodoi trangthai", // Chọn các trường cần thiết
      });

      // Lọc bỏ các bản ghi không có thông tin BoTruyen hợp lệ
      const validFollowingList = followingList.filter(item => item.bo_truyen);

      // Trả về danh sách bộ truyện
      const result = validFollowingList.map(item => ({
          id: item.bo_truyen._id,       // ID của bộ truyện
          tenbo: item.bo_truyen.tenbo,  // Tên bộ truyện
          poster: item.bo_truyen.poster, // Ảnh bìa
          danhgia: item.bo_truyen.danhgia, // Đánh giá
          theodoi: item.bo_truyen.theodoi, // Lượt theo dõi
          trangthai: item.bo_truyen.trangthai, // Trạng thái bộ truyện
      }));

      res.status(200).json({ success: true, data: result });
  } catch (error) {
      console.error("Error fetching following list:", error);
      res.status(500).json({ message: "Lỗi khi lấy danh sách bộ truyện theo dõi" });
  }
});

router.post("/unfollow", async (req, res) => {
  try {
      const { userId, comicId } = req.body; // Nhận userId và comicId từ body

      // Kiểm tra đầu vào
      if (!userId || !comicId) {
          return res.status(400).json({ message: "Thiếu thông tin userId hoặc comicId" });
      }

      // Tìm bản ghi và cập nhật theodoi thành false
      const updatedRecord = await CTBoTruyen.findOneAndUpdate(
          { user: userId, bo_truyen: comicId }, // Điều kiện tìm kiếm
          { theodoi: false },                  // Cập nhật theodoi thành false
          { new: true }                        // Trả về bản ghi đã cập nhật
      );

      // Kiểm tra nếu không tìm thấy bản ghi
      if (!updatedRecord) {
          return res.status(404).json({ message: "Không tìm thấy bản ghi để bỏ theo dõi" });
      }

      res.status(200).json({
          success: true,
          message: "Đã bỏ theo dõi thành công",
          data: updatedRecord,
      });
  } catch (error) {
      console.error("Error unfollowing comic:", error);
      res.status(500).json({ message: "Lỗi khi bỏ theo dõi" });
  }
});

// Lấy chi tiết khách hàng
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL

  try {
    // Tìm khách hàng với IdUser là chuỗi
    const khachHang = await KhachHang.findOne({ IdUser: id });

    if (!khachHang) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }

    // Tìm thông tin User từ bảng User dựa trên IdUser (chuỗi)
    const user = await User.findOne({ IdUser: khachHang.IdUser }).select("UserName Email");

    // Lấy thông tin Avatar từ bảng Avatar dựa trên IdAvatar
    let avatar = null;
    if (khachHang.IdAvatar) {
      avatar = await Avatar.findOne({ _id: khachHang.IdAvatar }).select("AvatarContent");
    }

    // Trả về thông tin khách hàng, User và Avatar
    res.status(200).json({
      ...khachHang._doc,    // Thông tin khách hàng
      UserDetail: user,     // Thông tin chi tiết từ User
      Avatar: avatar ? avatar.AvatarContent : null, // URL Avatar nếu có
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khách hàng:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin khách hàng" });
  }
});

// Cập nhật khách hàng
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {
        GoogleAccount,
        FacebookAccount,
        IdAvatar,
        TicketSalary,
        ActivePremium,
        ActiveStats,
        SocialLogins,
        Payments,
    } = req.body;

    try {
        const khachHang = await KhachHang.findByIdAndUpdate(
            id,
            {
                GoogleAccount,
                FacebookAccount,
                IdAvatar,
                TicketSalary,
                ActivePremium,
                ActiveStats,
                SocialLogins,
                Payments,
            },
            { new: true }
        );

        if (!khachHang) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        }

        res.status(200).json({ message: "Cập nhật khách hàng thành công", khachHang });
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật khách hàng" });
    }
});

// Xóa khách hàng
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const khachHang = await KhachHang.findByIdAndDelete(id);
        if (!khachHang) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        }
        res.status(200).json({ message: "Xóa khách hàng thành công" });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Lỗi khi xóa khách hàng" });
    }
});

// Thêm vé thưởng cho khách hàng
router.post("/:id/add-ticket", async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    try {
        const khachHang = await KhachHang.findByIdAndUpdate(
            id,
            { $inc: { TicketSalary: amount } }, // Tăng số vé thưởng
            { new: true }
        );

        if (!khachHang) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        }

        res.status(200).json({ message: "Thêm vé thưởng thành công", TicketSalary: khachHang.TicketSalary });
    } catch (error) {
        console.error("Error adding ticket:", error);
        res.status(500).json({ message: "Lỗi khi thêm vé thưởng" });
    }
});

// Xóa tất cả khách hàng
router.delete("/delete-all", async (req, res) => {
    try {
      // Xóa tất cả các bản ghi trong collection KhachHang
      const result = await KhachHang.deleteMany({}); // Xóa tất cả tài liệu
  
      res.status(200).json({
        success: true,
        message: `Đã xóa ${result.deletedCount} khách hàng thành công.`,
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa tất cả khách hàng.",
      });
    }
  });

module.exports = router;