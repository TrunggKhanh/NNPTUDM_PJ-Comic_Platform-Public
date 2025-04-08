const express = require("express");
const { uploadImageToCloudinary } = require("../middleware/ComicMiddleware");
const ComicController = require("../controllers/ComicController");
const {getChaptersByComicId ,
  addChapter,
  addImagesToChapter,
  completeChapter,
  updateChapterPages,
  getChapterDetails,
  deletePageFromChapter,checkChapterExists,getComicById, uploadImages ,updateComic } = require("../controllers/ComicController");
const multer = require("multer");


const upload = multer({ dest: "uploads-tmp/" }); // Thư mục lưu tạm file
const router = express.Router();

// Routes
router.get("/", ComicController.getAllComics);
router.post("/add-comic", ComicController.addComic);
router.delete("/:id", ComicController.deleteComic);
router.get("/top-comics", ComicController.getTopComics);

// Route upload ảnh (Bước 2)
router.post(
  "/:id/upload-images",
  upload.fields([{ name: "poster" }, { name: "banner" }]),
  ComicController.updateComicImages
);

router.put("/:id/update-stats", ComicController.updateComicStats);

// router.get("/export-to-sheet", exportComicsToSheet);

router.get("/:comicId/chapters", getChaptersByComicId);

// Lấy danh sách chương của bộ truyện
router.get("/:comicId/chapters", getChaptersByComicId);

// Thêm chương mới
router.post("/add-chapter", addChapter);

// Thêm ảnh vào chương
router.post("/:id_chapter/add-images", addImagesToChapter);

// Cập nhật danh sách trang
router.put("/:id_chapter/update-pages", updateChapterPages);

// Lấy chi tiết chương
router.get("/:id_chapter", getChapterDetails);

// Hoàn tất chương
router.put("/complete-chapter/:id_chapter", completeChapter);

// Xóa một trang trong chương
router.delete("/:id_chapter/page/:so_trang", deletePageFromChapter);

router.get("/:comicId/check-chapter", checkChapterExists);


// Route cập nhật thông tin bộ truyện
router.put('/:id/update-comic', updateComic);

// Route cập nhật ảnh bìa và banner
router.post('/:id/upload-images', uploadImages);

// Route lấy thông tin bộ truyện theo ID
router.get('/:id', getComicById);

module.exports = router;
