const mongoose = require('mongoose')

const translationSchema = new mongoose.Schema({
    textToTranslate: {
        type: String,
        required: true
    },
    timeOfTranslation:{
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Translation', translationSchema)