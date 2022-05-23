const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema(
    {
        path:{
            type: String,
            required: true
        },
        likes:{
            type: Number,
            min: 0,
            default: 0
        },
        type:{
            type: String,
            required: true
        },
        users:{
            type: Array,
            default: []
        }
    }
)

module.exports = mongoose.model('Media', mediaSchema)