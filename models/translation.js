const mongoose = require('mongoose')

const translationSchema = new mongoose.Schema({
    textToTranslate: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Translation', translationSchema)