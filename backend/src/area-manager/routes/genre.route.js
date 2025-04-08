const express = require("express");
const GenreController = require("../controllers/GenreController");
const router = express.Router();

// Lấy tất cả thể loại
router.get("/", GenreController.getAllLoaiTruyen);

// Thêm mới một thể loại
router.post("/", GenreController.addLoaiTruyen);

// Cập nhật thông tin thể loại
router.put("/:id", GenreController.updateLoaiTruyen);

// Xóa một thể loại
router.delete("/:genreId", GenreController.deleteGenre);

// Thay đổi trạng thái active của thể loại
router.post("/:id/toggle-active", GenreController.toggleActiveLoaiTruyen);

router.get("/:genreId/top-comics", GenreController.getTopComicsByGenre);

module.exports = router;
