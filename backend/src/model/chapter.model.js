const mongoose = require('mongoose');

// Schema của Page (thay thế cho CT_Chapter)
const PageSchema = new mongoose.Schema({
    so_trang: { type: Number, required: true }, // Số thứ tự trang
    anh_trang: { type: String, required: true }, // Đường dẫn ảnh
    active: { type: Boolean, default: true }, // Trạng thái hoạt động
});

const ChapterSchema = new mongoose.Schema({
    id_bo: { type: mongoose.Schema.Types.ObjectId, ref: 'BoTruyen', required: true }, // Liên kết với bộ truyện
    stt_chap: { type: Number, required: true }, // Số thứ tự chương
    ten_chap: { type: String, required: true }, // Tên chương
    content: { type: String }, // Nội dung chương
    thoi_gian: { type: Date, default: Date.now }, // Thời gian đăng chương
    trangthai: { type: String, enum: ['hoat_dong', 'tam_ngung'], default: 'hoat_dong' }, // Trạng thái chương
    premium: { type: Boolean, default: false }, // Chương có phải premium không
    ticket_cost: { type: Number, default: 0 }, // Giá vé đọc chương
    luotxem: { type: Number, default: 0 }, // Tổng số lượt xem
    active: { type: Boolean, default: true }, // Trạng thái hoạt động
    list_pages: [PageSchema], // Mảng chứa danh sách các trang
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

const Chapter = mongoose.model('Chapter', ChapterSchema);

module.exports = Chapter;
