const mongoose = require('mongoose')

const translationSchema = new mongoose.Schema({
    textToTranslate: {
        type: String,
        required: true
    },
    translatedText: {
        type: String,
        required: false
    }
})


module.exports = mongoose.model('Translation', translationSchema)