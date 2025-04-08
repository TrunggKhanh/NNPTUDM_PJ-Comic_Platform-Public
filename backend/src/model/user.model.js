const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        IdUser: { type: String, required: true, unique: true }, // ID User
        UserName: { type: String, required: false }, // Tên đăng nhập
        Password: { type: String, required: false }, // Mật khẩu
        FullName: { type: String, required: false }, // Tên đầy đủ
        Email: { type: String, required: false }, // Email
        Phone: { type: String, required: false }, // Số điện thoại
        Birth: { type: Date, required: false }, // Ngày sinh
        Gender: { type: Number, enum: [0, 1], required: false },
        TimeCreated: { type: Date, default: Date.now },
        TimeUpdated: { type: Date, default: null },
        Active: { type: Boolean, default: true }, 
        UserRole: { type: Boolean, default: false } 
    },
    {
        timestamps: false
    }
);

// Hash mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('Password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(user.Password, 10);
        user.Password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

// Phương thức so sánh mật khẩu
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.Password);
};
const User = model('User', userSchema);

module.exports = User;
