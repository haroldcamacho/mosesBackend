const express = require('express')
const router = express.Router()
const Translation = require('../models/translation')
const TranslatedText = require ('../models/completedTranslation')
const validator = require('express-validator')
//GetTranslations

router.get('/', async(req,res) =>{

    try{
        const translations = await Translation.find();
        res.json(translations);
    } catch(err){
        res.status(500).json({message: err.message})
    }
})


//Make a translation
router.post('/', async (req, res)=>{
    req.translation = new Translation();
    let textToTranslate = req.body.original_code;
    console.log(textToTranslate);
    // const translation = new Translation({
    //     textToTranslate: req.body.textToTranslate
    // })
    // try{
    //     const newTranslation = await translation.save()
    //     res.status(201).json(newTranslation)
    // } catch(err){
    //     res.status(400).json({message: err.message })
    // }

})



function processTextToTranslate(){
    return async(req, res) =>{
        let 
    }
}

module.exports = router