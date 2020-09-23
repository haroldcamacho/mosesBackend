const express = require('express')
const router = express.Router()
const Translation = require('../models/translation')

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
    const translation = new Translation({
        textToTranslate: req.body.textToTranslate
    })
    try{
        const newTranslation = await translation.save()
        res.status(201).json(newTranslation)
    } catch(err){
        res.status(400).json({message: err.message })
    }


})



module.exports = router