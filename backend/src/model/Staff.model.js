const { Schema, model } = require('mongoose');

const staffSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    StaffRole: { type: Boolean, default: false }, 
});

const Staff = model('Staff', staffSchema);

module.exports = Staff;
