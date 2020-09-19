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
router.post('/', (req, res)=>{

})



module.exports = router