const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
    user: { type: String, required: true },
    action: { type: String, required: true },
    detail: { type: String }
}, { timestamps: true }); 

module.exports = mongoose.model('ActionLog', actionLogSchema);
