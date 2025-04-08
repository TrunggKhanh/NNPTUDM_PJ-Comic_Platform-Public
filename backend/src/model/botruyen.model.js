const mongoose = require('mongoose');

// Feature Schema
const FeatureSchema = new mongoose.Schema({
    name: { type: String, required: true },  
    value: { type: String, required: true } 
});

// BoTruyen Schema
const BoTruyenSchema = new mongoose.Schema({
    tenbo: { type: String, required: true },       
    dotuoi: { type: String, required: true },   
    id_tg: { type: mongoose.Schema.Types.ObjectId, ref: 'TacGia', required: true }, // Tác giả
    mota: { type: String },                         // Mô tả
    danhgia: { type: Number, default: 0 },       // Tổng đánh giá
    theodoi: { type: Number, default: 0 },       // Tổng lượt theo dõi
    TongLuotXem: { type: Number, default: 0 },      // Tổng lượt xem
    poster: { type: String },                      // URL ảnh bìa
    banner: { type: String },                  // URL ảnh banner
    premium: { type: Boolean, default: false }, // Trạng thái premium
    trangthai: { 
        type: String, 
        enum: ['hoat_dong', 'tam_ngung', 'hoan_thanh'], 
        default: 'hoat_dong' 
    },                                              // Trạng thái bộ truyện
    active: { type: Boolean, default: true },       // Trạng thái hoạt động
    listloai: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LoaiTruyen' }], // Danh sách thể loại
    features: [FeatureSchema],                      
}, { timestamps: true });

const BoTruyen = mongoose.model('BoTruyen', BoTruyenSchema);

module.exports = BoTruyen;