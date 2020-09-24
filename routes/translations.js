const express = require('express')
const Translation = require('../models/translation')
const router = express.Router()
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
router.post('/', async(req, res)=>{
    let text = req.body.inputCode;
    console.log("SSS");
    //req.translation = new Translation();
    // await new Promise(r => setTimeout(r, 4000));
    console.log(req.body.inputCode);
})



function processTextToTranslate(){
    return async(req, res) =>{
        let translation = req.translation
        translation.textToTranslate = req.body.original_code
        console.log("this is "+req.body.original_code+"\n")
        // try{
        //     console.log(translation.textToTranslate);
        // }
        // catch(e){
        //     console.log(e);
        // }
    }
}

module.exports = router