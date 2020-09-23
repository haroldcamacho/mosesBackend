const mongoose = require('mongoose')

const completedTranslationSchema = new mongoose.Schema({
    textToTranslate: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('completedTranslation', completedTranslationSchema)