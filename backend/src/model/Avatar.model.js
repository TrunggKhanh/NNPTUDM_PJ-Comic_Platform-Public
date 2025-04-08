const { Schema, model } = require('mongoose');

const avatarSchema = new Schema(
    {
        AvatarContent: { type: String, required: false }, 
        Active: { type: Boolean, default: true }, 
    },
    {
        timestamps: true, 
    }
);
const Avatar = model('Avatar', avatarSchema);

module.exports = Avatar;
