const mongoose = require('mongoose');

const CTBoTruyenSchema = new mongoose.Schema({
    user: { type: String, ref: 'KhachHang', required: true },
    bo_truyen: { type: mongoose.Schema.Types.ObjectId, ref: 'BoTruyen', required: true },
    theodoi: { type: Boolean, default: false }, // Đang theo dõi
    danhgia: { type: Number, default: 0 },      // Đánh giá
    ls_moi: { type: String },                  // Lịch sử đọc mới nhất
});

const CTBoTruyen = mongoose.model('CTBoTruyen', CTBoTruyenSchema);
module.exports = CTBoTruyen;
