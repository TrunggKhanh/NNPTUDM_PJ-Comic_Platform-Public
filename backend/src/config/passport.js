require("dotenv").config();
const passport = require("passport");
const User = require("../model/user.model");
const KhachHang = require("../model/khachhang.model");
const Avatar = require("../model/Avatar.model");

// Hàm lấy danh sách avatar và chọn ngẫu nhiên
async function getRandomAvatar() {
  try {
    const avatars = await Avatar.find({ Active: true });
    if (avatars.length === 0) {
      return null; // Trả về null nếu không có avatar nào
    }
    const randomIndex = Math.floor(Math.random() * avatars.length);
    return avatars[randomIndex]._id; // Trả về ID của avatar ngẫu nhiên
  } catch (err) {
    console.error("Error fetching avatars:", err);
    return null;
  }
}

// Serialize User
passport.serializeUser((data, done) => {
  done(null, data.user.IdUser);
});

// Deserialize User
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ IdUser: id });
    if (!user) {
      console.error(`User not found with IdUser: ${id}`);
      return done(new Error("User not found"), null);
    }

    const khachHang = await KhachHang.findOne({ IdUser: id });
    if (!khachHang) {
      console.error(`KhachHang not found for IdUser: ${id}`);
      return done(new Error("KhachHang not found"), null);
    }

    done(null, { user, khachHang });
  } catch (err) {
    console.error("Error during deserialization:", err);
    done(err, null);
  }
});

module.exports = passport;
module.exports.getRandomAvatar = getRandomAvatar; // xuất thêm để dùng bên ngoài
