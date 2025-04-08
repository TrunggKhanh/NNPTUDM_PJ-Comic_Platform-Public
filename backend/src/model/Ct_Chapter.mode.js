const mongoose = require("mongoose");

// Kiểm tra xem model đã tồn tại chưa
const CT_ChapterSchema = new mongoose.Schema({
  id_bo: { type: mongoose.Schema.Types.ObjectId, ref: "BoTruyen", required: true },
  stt_chap: { type: Number, required: true },
  so_trang: { type: Number, required: true },
  anh_trang: { type: String, required: true },
  active: { type: Boolean, default: true },
});

// Chỉ đăng ký model nếu nó chưa được đăng ký
const CT_Chapter = mongoose.models.CT_Chapter || mongoose.model("CT_Chapter", CT_ChapterSchema);

module.exports = CT_Chapter;
