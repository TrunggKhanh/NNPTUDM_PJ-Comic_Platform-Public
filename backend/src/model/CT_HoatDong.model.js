const mongoose = require('mongoose');

const CtHoatDongSchema = new mongoose.Schema({
    id_bo: { type: mongoose.Schema.Types.ObjectId, ref: 'BoTruyen', required: true }, // Liên kết với bộ truyện
    stt_chap: { type: Number, required: true }, // Số thứ tự chương
    id_user: { type: String, ref: 'User', required: true }, // Liên kết với người dùng qua IdUser
    tt_doc: { type: Boolean, default: false } // Trạng thái đọc (đã đọc hay chưa)
}, { timestamps: true }); // Thêm thông tin thời gian tạo và cập nhật

const CtHoatDong = mongoose.model('CtHoatDong', CtHoatDongSchema);

module.exports = CtHoatDong;
