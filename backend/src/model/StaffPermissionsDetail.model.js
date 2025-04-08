const { Schema, model } = require('mongoose');

const staffPermissionsDetailSchema = new Schema({
    IdUser: { type: String, required: true, ref: 'Staff' }, // Tham chiếu đến Staff
    IdPermissions: { type: Number, required: true, ref: 'PermissionsList' },
    Active: { type: Boolean, default: true },
});

const StaffPermissionsDetail = model('StaffPermissionsDetail', staffPermissionsDetailSchema);

module.exports = StaffPermissionsDetail;
