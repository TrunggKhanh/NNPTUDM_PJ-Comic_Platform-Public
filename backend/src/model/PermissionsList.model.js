const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { Schema, model } = mongoose;

const permissionsListSchema = new Schema({
    IdPermissions: { type: Number },
    PermissionsName: { type: String, required: false },
    Description: { type: String, required: false },
    PermissionsStats: {
        type: String,
        enum: ['Có hiệu lực', 'Bảo trì', 'Ngừng vĩnh viễn'],
        required: true,
    },
    Active: { type: Boolean, default: true },
});

// Thêm plugin tự động tăng cho IdPermissions
permissionsListSchema.plugin(AutoIncrement, { inc_field: 'IdPermissions' });

const PermissionsList = model('PermissionsList', permissionsListSchema);

module.exports = PermissionsList;
