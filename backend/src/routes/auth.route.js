const express = require("express");
const passport = require("passport");
const User = require("../model/user.model");
const KhachHang = require("../model/khachhang.model");
const Avatar = require("../model/Avatar.model");
const router = express.Router();

// Đăng nhập Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const { user, newAccount } = req.user;

      if (newAccount) {
        const khachHang = await KhachHang.findOne({ IdUser: user.IdUser });
        const avatarContent = khachHang?.IdAvatar
          ? (await Avatar.findById(khachHang.IdAvatar)).AvatarContent
          : null;

        res.redirect(
          `http://localhost:5173/infor?user=${encodeURIComponent(
            JSON.stringify({
              id: user.IdUser,
              username: user.UserName,
              email: user.Email,
              avatar: avatarContent || "/uploads/Avatar/100008-spy-x-family-anya-1.png",
            })
          )}`
        );
      } else {
        const khachHang = await KhachHang.findOne({ IdUser: user.IdUser });
        let avatarContent = "/uploads/Avatar/100008-spy-x-family-anya-1.png";
        if (khachHang?.IdAvatar) {
          const avatar = await Avatar.findById(khachHang.IdAvatar);
          avatarContent = avatar ? avatar.AvatarContent : avatarContent;
        }
        res.redirect(
          `http://localhost:5173?user=${encodeURIComponent(
            JSON.stringify({
              id: user.IdUser,
              username: user.UserName,
              avatar: avatarContent,
            })
          )}`
        );
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      res.status(500).send("Internal server error");
    }
  }
);

// Đăng xuất
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
