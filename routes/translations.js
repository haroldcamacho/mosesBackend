const express = require('express')
const Translation = require('../models/translation')
const router = express.Router()
const validator = require('express-validator')
const xmlrpc = require ("davexmlrpc");
const urlEndpointXMLRPC = "http://localhost:8080/RPC2";
const verb = "translate";
const format = "xml"; //could also be "json"
const { rejects } = require('assert');
const specialCharactersRegex = /[^0-9a-zA-Z]/g;

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
    let codeWithoutLineBreaks = deleteLineBreaksFromText(codewithoutTabs);
    let decompiledCodeToRename = (separateBySpaceCharacter(codeWithoutLineBreaks));
    let decompiledCodeToRenameWithoutEmptyElements = deleteWhitespacesFromArray(decompiledCodeToRename);
    //console.log(separateBySpaceCharacter(test));

    //console.log(mapDecompiledCodeVariablesWithPositions(separateBySpaceCharacter(codeWithoutLineBreaks)));

    let mapDecompiled = mapDecompiledCodeVariablesWithPositions(separateBySpaceCharacter(codeWithoutLineBreaks));

    // console.log(mapDecompiled);
    // console.log('/n');

    let testArray = ["withExtension:","extension","|","basename","name","|","basename",":=","self", "basename.","^","(basename","endsWith:",
    "extension)","ifTrue:","[","self","]","ifFalse:","[","name", ":=", "basename",
    "copyUpToLast:","self","extensionDelimiter.","self","withName:","name","extension:","extension","]"];

    mapDecompiledVariablesWithTranslatedCode(mapDecompiled, testArray, decompiledCodeToRenameWithoutEmptyElements);


    //XMLRPC
    // let french = "faire revenir les militants sur le terrain et convaincre que le vote est utile .";
    // let textPromise = await (sendSimpleXMLRPC(french));
    // console.log(JSON.stringify(textPromise.text));



    //MISC
    // let codeDividedByLine = divideCodeByLines(codewithoutTabs);
    // console.log(codeDividedByLine);

    // console.log(separateBySpaceCharacter(codeDividedByLine.join('')));
    //translateCode(codeDividedByLine);
    // let originalCode = JSON.stringify(req.body.inputCode);
})

//RENAME DECOMPILED CODE
function countDuplicateWordsFromArray(codeArray){
    let dictionary = {};
    codeArray.forEach((x) => { 
        dictionary[x] = (dictionary[x] || 0)+1; 
        console.log(dictionary[x]);
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

function appendToSpecialCharacters(code){

}


function getSpecialCharactersPositions(code){

}

function selectMostUsedWord(arrayWithCounts){
    
}


async function mapDecompiledVariablesWithTranslatedCode(decompiledCodeMap, translatedCode, decompiledCode){
    //console.log(translatedCode);
    decompiledCodeMap.forEach(( arrayOfPositions, variableName)=> {
        let wordsFromTranslatedCode = [];
        arrayOfPositions.forEach(element => {
            wordsFromTranslatedCode.push(deleteSpecialCharactersFromVariables(translatedCode[element]));
        });
        //console.log("VAR IS: ",variableName ," ARRAY IS: ",wordsFromTranslatedCode);
        let aux = countDuplicateWordsFromArray(wordsFromTranslatedCode);
        console.log(aux);
        let aux2 = dictionaryToSortedArray(aux);
        let chosenName = aux2[0][0];
        console.log("THE CHOSEN NAME IS: ", chosenName);
        renameOnDecompiledCode(decompiledCode, arrayOfPositions, chosenName);
        });
}

async function renameOnDecompiledCode(decompiledCode, positionsOfVariable, newVariable){
    
}


//MOSES SERVER XMLRPC
async function translateDecompiledCodeWithMoses(decompiledCode){
    let translatedCode = [];
    decompiledCode.forEach(async (lineOfCode) => {
       translatedCode.push(await sendSimpleXMLRPC(lineOfCode));
    });
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
                //textToTranslate = await JSON.stringify(data);
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

function deleteWhitespacesFromArray(code){
    return code.filter(item => item.trim() !== '');
}

function hasTempOrArg(code){
    let variablesRegExp = /\barg[0-9]\b|\btmp[0-9]\b/;
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
        if(hasTempOrArg(element)){
            storeVariablesInDictionary(variablesMap, element, index)
        }
    });
    return variablesMap;
}


function divideCodeByLines(code){
    return code.trim().split(/\r\n|\r|\n/g);
}

function deleteTabSpaces(code){
    return code = code.replace(/\t/g, '');
}


function concatenateTranslatedLines(translatedCode){
    return translateCode.join(' ');
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