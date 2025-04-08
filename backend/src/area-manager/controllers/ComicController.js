const BoTruyen = require("../../model/botruyen.model");
const cloudinary = require("../config/cloudinaryClient");
const mongoose = require("mongoose");
const Chapter = require("../../model/chapter.model");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


// Lấy danh sách bộ truyện
exports.getAllComics = async (req, res) => {
  try {
    const { active, name } = req.query;
    const filter = {};
    if (active !== undefined) filter.active = active === "true";
    if (name) filter.tenbo = { $regex: name, $options: "i" };

    const comics = await BoTruyen.find(filter).lean();
    res.status(200).json(comics);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bộ truyện:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bộ truyện" });
  }
};

exports.addComic = async (req, res) => {
  try {
    const {
      tenbo,
      dotuoi,
      mota,
      listloai, // Mảng ObjectId
      premium,
      trangthai,
      active,
      theodoi,
      TongLuotXem,
      danhgia,
      id_tg,
    } = req.body;

    // Log dữ liệu nhận từ frontend
    console.log("Dữ liệu nhận được từ frontend:", req.body);

    if (!tenbo || !dotuoi || !id_tg) {
      return res.status(400).json({ message: "Dữ liệu bắt buộc bị thiếu!" });}

    // Chuyển đổi listloai từ JSON string thành ObjectId
    // Kiểm tra kiểu dữ liệu của listloai
    let listloaiObjectId = [];
    if (Array.isArray(listloai)) {
      // Nếu listloai là mảng, chuyển đổi từng phần tử thành ObjectId
      listloaiObjectId = listloai.map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return new mongoose.Types.ObjectId(id);
        }
        throw new Error(`Invalid ObjectId: ${id}`);
      });
    } else {
      // Nếu không phải mảng, báo lỗi
      console.error("Dữ liệu listloai không phải là mảng.");
      return res.status(400).json({ message: "Dữ liệu listloai không hợp lệ. Yêu cầu mảng." });
    }

    // Log sau khi chuyển đổi
    console.log("listloai sau khi chuyển đổi:", listloaiObjectId);

    // Dùng ảnh giả trong bước 1
    const poster = "https://via.placeholder.com/150";
    const banner = "https://via.placeholder.com/600";

    const newComic = new BoTruyen({
      tenbo,
      dotuoi,
      mota,
      listloai: listloaiObjectId, // Mảng ObjectId hợp lệ
      premium: premium === "true",
      trangthai,
      active: false, // Mặc định là false
      theodoi: parseInt(theodoi, 10) || 0,
      TongLuotXem: parseInt(TongLuotXem, 10) || 0,
      danhgia: parseFloat(danhgia) || 0,
      id_tg,
      poster,
      banner,
    });

    await newComic.save();
    res.status(201).json({ message: "Bộ truyện đã được thêm thành công!", comic: newComic });
  } catch (error) {
    console.error("Lỗi khi thêm bộ truyện:", error);
    res.status(500).json({ message: "Lỗi khi thêm bộ truyện.", error });
  }
};


// Cập nhật ảnh bìa và banner (Bước 2)
exports.updateComicImages = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedFields = {};

    // Upload ảnh bìa
    if (req.files["poster"]) {
      const result = await cloudinary.uploader.upload(req.files["poster"][0].path);
      updatedFields.poster = result.secure_url;
    }

    // Upload ảnh banner
    if (req.files["banner"]) {
      const result = await cloudinary.uploader.upload(req.files["banner"][0].path);
      updatedFields.banner = result.secure_url;
    }

    const updatedComic = await BoTruyen.findByIdAndUpdate(id, updatedFields, { new: true });
    res.status(200).json({ message: "Cập nhật ảnh thành công!", comic: updatedComic });
  } catch (error) {
    console.error("Lỗi khi cập nhật ảnh:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật ảnh." });
  }
};

// Controller cập nhật thông tin bộ truyện
exports.updateComic = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenbo, dotuoi, mota, listloai, premium, trangthai, active, id_tg } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!tenbo || !dotuoi || !id_tg) {
      return res.status(400).json({ message: 'Dữ liệu bắt buộc bị thiếu!' });
    }

    // Chuyển đổi `listloai` sang ObjectId
    let listloaiObjectId = [];
    if (Array.isArray(listloai)) {
      listloaiObjectId = listloai.map((id) => mongoose.Types.ObjectId(id));
    }

    const updatedComic = await BoTruyen.findByIdAndUpdate(
      id,
      {
        tenbo,
        dotuoi,
        mota,
        listloai: listloaiObjectId,
        premium: premium === 'true',
        trangthai,
        active: active === 'true',
        id_tg: mongoose.Types.ObjectId(id_tg),
      },
      { new: true }
    );

    if (!updatedComic) {
      return res.status(404).json({ message: 'Không tìm thấy bộ truyện!' });
    }

    res.status(200).json({ message: 'Cập nhật thông tin thành công!', comic: updatedComic });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin bộ truyện:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin bộ truyện.', error });
  }
};


// Controller cập nhật ảnh bìa và banner
exports.uploadImages = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra nếu không có tệp nào được tải lên
    if (!req.files || (!req.files.poster && !req.files.banner)) {
      return res.status(400).json({ message: 'Không có tệp nào được tải lên!' });
    }

    const updatedFields = {};

    // Upload ảnh bìa
    if (req.files.poster) {
      const posterResult = await cloudinary.uploader.upload(req.files.poster[0].path);
      updatedFields.poster = posterResult.secure_url;
    }

    // Upload ảnh banner
    if (req.files.banner) {
      const bannerResult = await cloudinary.uploader.upload(req.files.banner[0].path);
      updatedFields.banner = bannerResult.secure_url;
    }

    // Cập nhật dữ liệu bộ truyện
    const updatedComic = await BoTruyen.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedComic) {
      return res.status(404).json({ message: 'Không tìm thấy bộ truyện!' });
    }

    res.status(200).json({ message: 'Cập nhật ảnh thành công!', comic: updatedComic });
  } catch (error) {
    console.error('Lỗi khi cập nhật ảnh:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật ảnh.', error });
  }
};
// Controller lấy thông tin bộ truyện
exports.getComicById = async (req, res) => {
  try {
    const { id } = req.params;

    const comic = await BoTruyen.findById(id)
      .populate('id_tg', 'ten_tg')
      .populate('listloai', 'ten_loai');

    if (!comic) {
      return res.status(404).json({ message: 'Không tìm thấy bộ truyện!' });
    }

    res.status(200).json(comic);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin bộ truyện:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin bộ truyện.', error });
  }
};

// Xóa bộ truyện
exports.deleteComic = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComic = await BoTruyen.findByIdAndDelete(id);
    if (!deletedComic) return res.status(404).json({ message: "Bộ truyện không tồn tại" });

    res.status(200).json({ message: "Xóa bộ truyện thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa bộ truyện:", error);
    res.status(500).json({ message: "Lỗi khi xóa bộ truyện" });
  }
};

// Lấy top truyện nổi bật theo đánh giá
exports.getTopComics = async (req, res) => {
  try {
    const topComics = await BoTruyen.find()
      .sort({ danhgia: -1 }) // Sắp xếp theo đánh giá giảm dần
      .limit(5);

    res.status(200).json(topComics);
  } catch (error) {
    console.error("Lỗi khi lấy top bộ truyện:", error);
    res.status(500).json({ message: "Lỗi khi lấy top bộ truyện" });
  }
};

// Cập nhật trạng thái (active, premium, trangthai)
exports.updateComicStats = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID bộ truyện từ URL
    const { active, premium, trangthai } = req.body; // Nhận dữ liệu stats

    // Cập nhật các trường stats
    const updatedComic = await BoTruyen.findByIdAndUpdate(
      id,
      {
        active: active,
        premium: premium,
        trangthai: trangthai,
      },
      { new: true } // Trả về document đã được cập nhật
    );

    if (!updatedComic) {
      return res.status(404).json({ message: "Bộ truyện không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật stats thành công!",
      comic: updatedComic,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật stats:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật stats." });
  }
};


// Lấy danh sách chương của một bộ truyện
exports.getChaptersByComicId = async (req, res) => {
  try {
    const { comicId } = req.params;

    // Tìm tất cả các chương liên quan đến bộ truyện
    const chapters = await Chapter.find({ id_bo: comicId }).sort({ stt_chap: 1 });
    if (!chapters || chapters.length === 0) {
      return res.status(404).json({ message: "Không có chương nào được tìm thấy cho bộ truyện này!" });
    }

    res.status(200).json({ message: "Lấy danh sách chương thành công!", data: chapters });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chương:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách chương!" });
  }
};

exports.addChapter = async (req, res) => {
  try {
    console.log("Dữ liệu nhận được từ frontend:", req.body);
    const { id_bo, stt_chap, ten_chap, premium, ticket_cost } = req.body;

    if (!id_bo || !stt_chap || !ten_chap) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc!" });
    }

    const newChapter = new Chapter({
      id_bo,
      stt_chap,
      ten_chap,
      premium: premium || false,
      ticket_cost: ticket_cost || 0,
      list_pages: [], // Khởi tạo danh sách trang là mảng rỗng
    });

    await newChapter.save();

    res.status(201).json({
      message: "Chương mới đã được tạo thành công!",
      chapter: newChapter,
    });
  } catch (error) {
    console.error("Lỗi khi tạo chương mới:", error);
    res.status(500).json({ message: "Lỗi khi tạo chương mới.", error });
  }
};


exports.addImagesToChapter = [
  upload.array("files"), // Middleware xử lý file upload
  async (req, res) => {
    try {
      const { id_chapter } = req.params;
      const images = req.files;
      if (!images || images.length === 0) {
        return res.status(400).json({ message: "Không có ảnh nào được upload!" });
      }
      const chapter = await Chapter.findById(id_chapter);
      if (!chapter) {
        return res.status(404).json({ message: "Không tìm thấy chương!" });
      }
      for (const file of images) {
        const result = await cloudinary.uploader.upload(file.path);
        chapter.list_pages.push({
          so_trang: chapter.list_pages.length + 1,
          anh_trang: result.secure_url,
          active: true,
        });
      }
      await chapter.save();
      res.status(201).json({
        message: "Thêm ảnh thành công!",
        chapter,
      });
    } catch (error) {
      console.error("Lỗi khi thêm ảnh vào chương:", error);
      res.status(500).json({ message: "Lỗi khi thêm ảnh vào chương.", error });
    }
  },
];

exports.completeChapter = async (req, res) => {
  try {
    const { id_chapter } = req.params;

    const updatedChapter = await Chapter.findByIdAndUpdate(
      id_chapter,
      { trangthai: "hoat_dong" },
      { new: true }
    );

    if (!updatedChapter) {
      return res.status(404).json({ message: "Không tìm thấy chương để hoàn tất!" });
    }

    res.status(200).json({
      message: "Chương đã được hoàn tất!",
      chapter: updatedChapter,
    });
  } catch (error) {
    console.error("Lỗi khi hoàn tất chương:", error);
    res.status(500).json({ message: "Lỗi khi hoàn tất chương.", error });
  }
};


exports.updateChapterPages = async (req, res) => {
  try {
    const { id_chapter } = req.params;
    const { pages } = req.body;

    if (!pages || !Array.isArray(pages)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
    }

    const chapter = await Chapter.findById(id_chapter);
    if (!chapter) {
      return res.status(404).json({ message: "Không tìm thấy chương!" });
    }

    chapter.list_pages = pages.map((page, index) => ({
      so_trang: index + 1,
      anh_trang: page.anh_trang,
      active: page.active !== undefined ? page.active : true,
    }));

    await chapter.save();

    res.status(200).json({
      message: "Cập nhật danh sách trang thành công!",
      chapter,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh sách trang:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật danh sách trang.", error });
  }
};

exports.getChapterDetails = async (req, res) => {
  try {
    const { id_chapter } = req.params;
    if (!id_chapter || !id_chapter.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID chương không hợp lệ!" });
    }
    // Tìm chapter theo ID và populate tất cả các thông tin liên quan
    const chapter = await Chapter.findById(id_chapter)
      .populate("id_bo", "tenbo mota TongLuotXem theodoi danhgia trangthai") // Populate bộ truyện với các trường chi tiết
      .populate({
        path: "list_pages", // Nếu list_pages là mảng các ObjectId
        select: "so_trang anh_trang active", // Chọn các trường cần thiết
      });

    if (!chapter) {
      return res.status(404).json({ message: "Không tìm thấy chương!" });
    }

    res.status(200).json({
      message: "Lấy thông tin chương thành công!",
      chapter,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin chương:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin chương.", error });
  }
};


exports.deletePageFromChapter = async (req, res) => {
  try {
    const { id_chapter, so_trang } = req.params;

    const chapter = await Chapter.findById(id_chapter);
    if (!chapter) {
      return res.status(404).json({ message: "Không tìm thấy chương!" });
    }

    // Xóa trang dựa trên số thứ tự
    chapter.list_pages = chapter.list_pages.filter((page) => page.so_trang !== parseInt(so_trang));

    // Cập nhật lại số thứ tự
    chapter.list_pages.forEach((page, index) => {
      page.so_trang = index + 1;
    });

    await chapter.save();

    res.status(200).json({
      message: "Xóa trang thành công!",
      chapter,
    });
  } catch (error) {
    console.error("Lỗi khi xóa trang:", error);
    res.status(500).json({ message: "Lỗi khi xóa trang.", error });
  }
};
exports.checkChapterExists = async (req, res) => {
  try {
    const { comicId } = req.params; // Lấy ID bộ truyệna
    const { stt_chap } = req.query; // Lấy số thứ tự chương từ query string

    if (!comicId || !stt_chap) {
      return res.status(400).json({ message: "Thiếu thông tin ID bộ truyện hoặc số thứ tự chương!" });
    }

    const chapterExists = await Chapter.exists({ id_bo: comicId, stt_chap: parseInt(stt_chap, 10) });

    res.status(200).json({ exists: !!chapterExists }); // Trả về true nếu tồn tại, false nếu không
  } catch (error) {
    console.error("Lỗi khi kiểm tra số chương:", error);
    res.status(500).json({ message: "Lỗi khi kiểm tra số chương.", error });
  }
};

exports.updateChapterState = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { active, premium } = req.body;

    const updateData = {};
    if (active !== undefined) updateData.active = active;
    if (premium !== undefined) updateData.premium = premium;

    const updatedChapter = await Chapter.findByIdAndUpdate(chapterId, updateData, { new: true });

    if (!updatedChapter) {
      return res.status(404).json({ message: "Không tìm thấy chương!" });
    }

    res.status(200).json({ message: "Cập nhật thành công!", chapter: updatedChapter });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái chương:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái chương." });
  }
};

// Đường dẫn tới file credentials
// const CREDENTIALS_PATH = path.join(__dirname, "../config/credentials.json");

// // Hàm xuất dữ liệu lên Google Sheets
// const exportComicsToSheet = async (req, res) => {
//   try {
//     // Đọc credentials
//     const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
//     const auth = new google.auth.GoogleAuth({
//       credentials,
//       scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//     });

//     const sheets = google.sheets({ version: "v4", auth });

//     // ID của Google Sheet (tạo trước và copy vào đây)
//     const SPREADSHEET_ID = "your_google_sheet_id";

//     // Lấy dữ liệu từ MongoDB
//     const comics = await BoTruyen.find().populate("id_tg listloai").exec();

//     // Chuẩn bị dữ liệu để ghi vào sheet
//     const rows = [
//       ["ID", "Tên Bộ Truyện", "Độ Tuổi", "Tác Giả", "Mô Tả", "Lượt Xem", "Premium", "Trạng Thái"], // Header
//       ...comics.map((comic) => [
//         comic._id,
//         comic.tenbo,
//         comic.dotuoi,
//         comic.id_tg?.ten_tg || "Không rõ",
//         comic.mota || "",
//         comic.TongLuotXem,
//         comic.premium ? "Có" : "Không",
//         comic.trangthai,
//       ]),
//     ];

//     // Ghi dữ liệu lên Google Sheets
//     await sheets.spreadsheets.values.update({
//       spreadsheetId: SPREADSHEET_ID,
//       range: "Sheet1!A1", // Vị trí bắt đầu ghi dữ liệu
//       valueInputOption: "RAW",
//       resource: {
//         values: rows,
//       },
//     });

//     res.status(200).json({ message: "Dữ liệu đã được xuất thành công!" });
//   } catch (error) {
//     console.error("Lỗi khi xuất dữ liệu lên Google Sheets:", error);
//     res.status(500).json({ message: "Lỗi khi xuất dữ liệu", error });
//   }
// };

// module.exports = { exportComicsToSheet };
