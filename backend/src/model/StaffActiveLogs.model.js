const { Schema, model } = require('mongoose');

const staffActiveLogSchema = new Schema({
    IdLog: { type: Schema.Types.ObjectId, auto: true },
    IdUser: { type: String, required: true, ref: 'Staff' }, 
    IdPermissions: { type: Number, required: true, ref: 'PermissionsList' },
    ChangeDescription: { type: String, required: false }, 
    TimeChanged: { type: Date, default: Date.now }, 
});

const StaffActiveLogs = model('StaffActiveLogs', staffActiveLogSchema);

module.exports = StaffActiveLogs;
