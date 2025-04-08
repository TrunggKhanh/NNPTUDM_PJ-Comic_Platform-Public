const mongoose = require('mongoose');

const CtChapterSchema = new mongoose.Schema({
    id_bo: { type: mongoose.Schema.Types.ObjectId, ref: 'BoTruyen', required: true }, // Liên kết với bộ truyện
    stt_chap: { type: Number, required: true }, // Số thứ tự chương
    so_trang: { type: Number, required: true }, // Số trang của chương
    anh_trang: [{ type: String, required: true }], // Danh sách URL ảnh của các trang
    active: { type: Boolean, default: true } // Trạng thái hoạt động
}, { timestamps: true }); 

const CtChapter = mongoose.model('CtChapter', CtChapterSchema);

module.exports = CtChapter;
