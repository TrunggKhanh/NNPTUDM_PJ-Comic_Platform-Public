const mongoose = require('mongoose');

const TacGiaSchema = new mongoose.Schema({
    ten_tg: { type: String, required: true },  // Tên tác giả
    active: { type: Boolean, default: true }, // Trạng thái hoạt động của tác giả
}, { timestamps: true });

const TacGia = mongoose.model('TacGia', TacGiaSchema);

module.exports = TacGia;