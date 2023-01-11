const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
        required: false,
        default: ''
    },
},{
    timestamps: true
});

var Items = mongoose.model('Item', itemSchema);

module.exports = Items;