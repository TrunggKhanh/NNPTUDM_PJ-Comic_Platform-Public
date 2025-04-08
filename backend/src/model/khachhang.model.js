const { Schema, model } = require('mongoose');

const khachHangSchema = new Schema(
    {
        IdUser: { type: String, required: true, ref: 'User' }, // Tham chiếu tới bảng User
        GoogleAccount: { type: String, required: false }, // Tài khoản Google
        FacebookAccount: { type: String, required: false }, // Tài khoản Facebook
        IdAvatar: { type: String, required: false }, // ID ảnh đại diện
        TicketSalary: { type: Number, required: false, default: 0 }, // Vé thưởng
        ActivePremium: { type: Boolean, default: false }, // Trạng thái Premium
        ActiveStats: { type: Number, default: 1 }, // Trạng thái hoạt động

        SocialLogins: [
            {
                LoginProvider: { type: String, required: true }, // Nhà cung cấp (Google, Facebook, etc.)
                ProviderKey: { type: String, required: true }, // ID từ nhà cung cấp
            },
        ],

        Payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
    },
    {
        timestamps: false // Không tự động tạo thời gian cập nhật
    }
);

// Xuất mô hình
const KhachHang = model('KhachHang', khachHangSchema);

module.exports = KhachHang;
