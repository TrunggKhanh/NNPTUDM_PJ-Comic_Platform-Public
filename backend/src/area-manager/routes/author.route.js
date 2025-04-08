const express = require("express");
const router = express.Router();
const TacGiaController = require("../controllers/AuthorController");

// Lấy tất cả tác giả
router.get("/", TacGiaController.getAllTacGia);

// Thêm mới một tác giả
router.post("/", TacGiaController.addTacGia);

// Cập nhật thông tin tác giả
router.put("/:id", TacGiaController.updateTacGia);

// Xóa một tác giả
router.delete("/:id", TacGiaController.deleteTacGia);

// Toggle trạng thái active của tác giả
router.post("/:id/toggle-active", TacGiaController.toggleActiveTacGia);

// Thêm route trong author.route.js
router.get("/:id/top-comics", TacGiaController.getTopComicsByAuthor);


module.exports = router;
