const express = require('express')
const Translation = require('../models/translation')
const router = express.Router()
const validator = require('express-validator')
const xmlrpc = require ("davexmlrpc");
const urlEndpointXMLRPC = "http://localhost:8080/RPC2";
const verb = "translate";
const format = "xml";
const { rejects } = require('assert');
const { type } = require('os');
const { nextTick } = require('process');
const translation = require('../models/translation');
const specialCharactersRegex = /[^0-9a-zA-Z]/g;
const variablesRegExp = /\barg[0-9]\b|\btmp[0-9]\b/;

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
    let translation = req.translation;
    let inputCode = req.body.inputCode;
    translation.textToTranslate = inputCode;
    let translatedCode = await translateCode(inputCode);
    translation.translatedText =  translatedCode;

    try {
        translation = await translation.save();
        res.render(`translated.ejs`, {
            originalCode: inputCode , translatedCode: translatedCode})
    } catch (error) {
        console.log(error);
        res.redirect(`/error`)
    }
    
})


router.post('/translatejson', async(req, res)=>{
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: await translateCode(req.body.inputCode)
      })
      try {
        const newTranslation = await translation.save()
        res.status(201).json(newTranslation)
      } catch (err) {
        res.status(400).json({ message: err.message })
      } 
})


router.post('/translate', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})

router.post('/translatenolbjson', async(req, res)=>{
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: await translateCodeWithouthLinebreaks(req.body.inputCode)
      })
      try {
        const newTranslation = await translation.save()
        res.status(201).json(newTranslation)
      } catch (err) {
        res.status(400).json({ message: err.message })
      } 
})

// async function translateCodeWithouthLinebreaks(originalCode){
//     //console.log("ORGINAL CODE\n", originalCode)
//     let renamedCode;
//     let processedInputCode = processInputCode(originalCode);
//     console.log("PROCESSED INPUT CODE\n", processedInputCode);
//     let inputCodeSeparatedByLines = processInputCodeForMoses(originalCode);
//     console.log("CODE DIVIDED BY LINES OG \n",inputCodeSeparatedByLines);
//     let mapOfVariablesToRename = mapDecompiledCodeVariablesWithPositions(processedInputCode);
//     console.log("MAP LENGTH\n", mapOfVariablesToRename.size);
//     if(mapOfVariablesToRename.size>0){
//         console.log("VARIABLES TO RENAME\n", mapOfVariablesToRename);
//         let translatedCodeSeparatedByLines = await sendLineByLineToMoses(inputCodeSeparatedByLines);
//         console.log("PROCESSED CODE BY MOSES\n", translatedCodeSeparatedByLines);
//         let translatedCodeSeparatedByWords = separateCodeInLinesByWords(translatedCodeSeparatedByLines);
//         console.log("TRANSLATED CODE SEPARATED BY WORDS\n", translatedCodeSeparatedByWords);
//         console.log("NUMBER OF WORDS OG CODE\n", processedInputCode.length);
//         console.log("NUMBER OF WORDS TRANSLATED CODE\n", translatedCodeSeparatedByWords.length);
//         //renamedCode = renameDecompiledCode(mapOfVariablesToRename, translatedCodeSeparatedByWords, processedInputCode);
//         //renamedCode = renamedCode.join(" ");
//     }
//     else{
//         renamedCode = originalCode;
//     }


//     return "placeholder";
//     //return renamedCode;
// }

async function translateCodeWithouthLinebreaks(originalCode){
    let renamedCode;
    let inputCodeSeparatedByLines = processInputCodeForMoses(originalCode);
    let translatedCodeSeparatedByLines = await sendLineByLineToMoses(inputCodeSeparatedByLines);
    renamedCode = translatedCodeSeparatedByLines.join(" ");
    return renamedCode;
}

async function translateCode(originalCode){
    let processedInputCode = processInputCode(originalCode);
    let inputCodeSeparatedByLines = processInputCodeForMoses(originalCode);
    let mapOfVariablesToRename = mapDecompiledCodeVariablesWithPositions(processedInputCode);

    let translatedCodeSeparatedByLines = await sendLineByLineToMoses(inputCodeSeparatedByLines);


    let lineBreaksPositions = mapLineBreaks(translatedCodeSeparatedByLines);

    let translatedCodeSeparatedByWords = separateCodeInLinesByWords(translatedCodeSeparatedByLines);


    let renamedCode = renameDecompiledCode(mapOfVariablesToRename, translatedCodeSeparatedByWords, processedInputCode);



    let repositionedCode = addLineBreaksToTranslatedCode(lineBreaksPositions, renamedCode)


    
    repositionedCode = repositionedCode.join(' ');

    return repositionedCode;

}


function addLineBreaksToTranslatedCode(lineBreaksMap, codeSeparatedByWords){
    let codeJoinedByLines = [];
    let lineOfCode = "";
    lineBreaksMap.forEach(element => {
        for (let index = 0; index < element; index++) {
            lineOfCode = lineOfCode.concat(codeSeparatedByWords.shift()," ");
        }
        lineOfCode = lineOfCode.trimEnd();
        codeJoinedByLines.push(lineOfCode.concat("\r\n"));
        lineOfCode = "";
    });
    return codeJoinedByLines;
}


function processInputCode(inputCode){
    let processedCode = deleteTabSpaces(inputCode);
    processedCode = deleteLineBreaksFromText(processedCode);
    processedCode = separateBySpaceCharacter(processedCode);
    processedCode = deleteWhitespacesFromArray(processedCode);
    return processedCode;
}

function mapLineBreaks(inputCode){
    let lineBreaksPosition = [];
    let codeWithoutSpaces;
    inputCode.forEach(element => {
        codeWithoutSpaces = element.trim();
        lineBreaksPosition.push(codeWithoutSpaces.split(' ').length);
    });
    return lineBreaksPosition;
}


function processInputCodeForMoses(inputCode){
    let processedCode = deleteTabSpaces(inputCode);
    processedCode = divideCodeByLines(processedCode);    
    return processedCode;
}


//RENAME DECOMPILED CODE
function countDuplicateWordsFromArray(codeArray){
    let dictionary = {};
    codeArray.forEach((x) => { 
        dictionary[x] = (dictionary[x] || 0)+1; 
    });
    return dictionary;
}

function dictionaryToSortedArray(dictionary){
    let items = dictionaryToArray(dictionary);
    items.sort(function(first, second) {
    return second[1] - first[1];
    });
    return items;
}

function dictionaryToArray(dictionary) {
    return Object.keys(dictionary).map(function (key) {
        return [key, dictionary[key]];
    });
}



function renameDecompiledCode(decompiledCodeMap, translatedCode, decompiledCode){
    decompiledCodeMap.forEach(( arrayOfPositions, variableName)=> {
        let wordsFromTranslatedCode = [];
        arrayOfPositions.forEach(element => {
            wordsFromTranslatedCode.push(deleteSpecialCharactersFromVariables(translatedCode[element]));
        });
        let aux = countDuplicateWordsFromArray(wordsFromTranslatedCode);
        let aux2 = dictionaryToSortedArray(aux);
        let chosenName = aux2[0][0];
        //console.log("THE CHOSEN NAME FOR:",variableName ," IS: ", chosenName);
        decompiledCode = renameOnDecompiledCode(decompiledCode, arrayOfPositions, chosenName);
        });
    return decompiledCode;
}

function renameOnDecompiledCode(decompiledCode, variablePositions, newVariableName){
    variablePositions.forEach(variablePosition => {
        decompiledCode[variablePosition] = decompiledCode[variablePosition].replace(variablesRegExp,newVariableName)
    });
    return decompiledCode;
}



//MOSES SERVER XMLRPC
async function sendLineByLineToMoses(decompiledCodeSeparatedByLines){
        let translatedCode = [];
        let lineOfCode = "";
        for (let index = 0; index < decompiledCodeSeparatedByLines.length; index++) {
            lineOfCode = await sendSimpleXMLRPC(decompiledCodeSeparatedByLines[index]);
            translatedCode.push(lineOfCode.text);
        }
        return translatedCode;
}

async function sendSimpleXMLRPC(textToTranslate){
    let requestObject = [{"text": textToTranslate, "align":"false", "report-all-factors":"false"}];
    return new Promise((resolve, reject) =>{
        xmlrpc.client (urlEndpointXMLRPC, verb, requestObject, format, async function(err, data) {
            if (err) {
                reject(err);
                }
            else {
                resolve(data);
                }
            });
    });
    
}

//TEXT FUNCTIONS

function separateBySpaceCharacter(code) {
    return code.split(' ');
}


function deleteLineBreaksFromText(code){
    return code.replace(/\r\n|\r|\n/gm, ' ');
}

function divideCodeByLines(code){
    return code.trim().split(/\r\n|\r|\n/g);
}

function deleteWhitespacesFromArray(code){
    return code.filter(item => item.trim() !== '');
}

function isVariableToRename(code){
    return (variablesRegExp.test(code));
}

function storeVariablesInDictionary(map, key, value){
    key = deleteSpecialCharactersFromVariables(key);
    if (!map.has(key)) {
        map.set(key, [value]);
        return;
    }
    map.get(key).push(value);
}

function deleteSpecialCharactersFromVariables(code){
    //let regExp = /\)|\(|\|/g;
    //let regExp =/[^0-9a-zA-Z]/g;
    return (code.replace(specialCharactersRegex,''));
}

function mapDecompiledCodeVariablesWithPositions(originalCodeAsArray){
    let variablesMap = new Map();
    originalCodeAsArray.forEach((element,index) => {
        if(isVariableToRename(element)){
            storeVariablesInDictionary(variablesMap, element, index)
        }
    });
    return variablesMap;
}


function deleteTabSpaces(code){
    return code = code.replace(/\t/g, '');
}


function concatenateTranslatedLines(translatedCode){
    let processedCode = translatedCode.join(' ');
    return processedCode;
}


function separateCodeInLinesByWords(arrayOfLines){
    let processedCode = arrayOfLines.join(' ');
    processedCode = processedCode.trim();
    processedCode = processedCode.split(' ');
    processedCode = deleteWhitespacesFromArray(processedCode)
    return processedCode;
}


module.exports = router