const express = require('express')
const Translation = require('../models/translation')
const router = express.Router()
const validator = require('express-validator')
const xmlrpc = require ("davexmlrpc");
const urlEndpointXMLRPC = "http://localhost:8000/RPC2";
const verb = "";
const format = "xml"; //could also be "json"


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
    req.translation = new Translation();
    let originalCode = req.body.inputCode;
    let codewithoutTabs = deleteTabSpaces(originalCode);
    let test = codewithoutTabs.replace(/\r\n|\r|\n/g, ' ');
    //console.log(separateBySpaceCharacter(test));
    mapDecompiledCodeVariablesWithPositions(separateBySpaceCharacter(test));
    // let codeDividedByLine = divideCodeByLine(codewithoutTabs);
    // console.log(codeDividedByLine);

    // console.log(separateBySpaceCharacter(codeDividedByLine.join('')));
    //translateCode(codeDividedByLine);
    // let originalCode = JSON.stringify(req.body.inputCode);
})



function separateBySpaceCharacter(code) {
    return code.split(' ');
}

function deleteLineBreaksFromText(code){
    return code.replace(/\r\n|\r|\n/g, ' ');
}

function hasTempOrVar(code){
    let variablesRegExp = /\bvar[0-9]\b|\btmp[0-9]\b/;
    return (variablesRegExp.test(code));
}

function setValue(map, key, value){
    key = deleteSpecialCharactersFromVariables(key);
    if (!map.has(key)) {
        map.set(key, [value]);
        return;
    }
    map.get(key).push(value);
}

function deleteSpecialCharactersFromVariables(code){
    let regExp = /\)|\(|\|/g;
    return (code.replace(regExp,''));
}

function mapDecompiledCodeVariablesWithPositions(originalCodeAsArray){
    let variablesMap = new Map();

    originalCodeAsArray.forEach((element,index) => {

        if(hasTempOrVar(element)){
            setValue(variablesMap, element, index)
        }
        
    });
    console.log(variablesMap);

}

function divideCodeByLine(code){
    return code.trim().split(/\r\n|\r|\n/g);
}

function deleteTabSpaces(code){
    return code = code.replace(/\t/g, '');
}

function sendXMLRPC(text){
    let requestMap = new Map();
    map.set(text,'');
    xmlrpc.client(urlEndpointXMLRPC, verb, requestMap, format, (err,data) =>{
        if(err){
            console.log("err.message ==" + err.message);
        }
        else{
            console.log(JSON.stringify(data));
            text = JSON.stringify(data);
        }
    });
    return text;
}

function replaceVariableNames(originalCode, translatedCode) {
    
}

function mapOriginalCodeVariables(originalCode){

}



function translateCode(code){
    return async(req, res) =>{
        let translation = req.translation
        let originalType = req.body.original_code
        console.log(originalType);
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