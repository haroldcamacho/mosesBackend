const express = require('express')
const Translation = require('../models/translation')
const router = express.Router()
const xmlrpc = require ("davexmlrpc");
const { exec } = require("child_process");
const { on } = require('process');


const urlEndpointXMLRPC = "http://localhost:8090/RPC2";
const CalypsoEndpointXMLRPC = "http://localhost:8080/RPC2";
const FuelEndpointXMLRPC = "http://localhost:8070/RPC2";
const GlamourEndpointXMLRPC = "http://localhost:8060/RPC2";
const GTEndpointXMLRPC = "http://localhost:8050/RPC2";
const IcebergEndpointXMLRPC = "http://localhost:8040/RPC2";
const KernelEndpointXMLRPC = "http://localhost:8030/RPC2";
const MetacelloEndpointXMLRPC = "http://localhost:8020/RPC2";
const MorphicEndpointXMLRPC = "http://localhost:8010/RPC2";
const RefactoringEndpointXMLRPC = "http://localhost:8000/RPC2";
const SeasideEndpointXMLRPC = "http://localhost:7090/RPC2";
const Spec2EndpointXMLRPC = "http://localhost:7080/RPC2";

const verb = "translate";
const format = "xml";
const specialCharactersRegex = /[^0-9a-zA-Z]/g;
const variablesRegExp = /\barg[0-9]\b|\btmp[0-9]\b/;
const logProbabilityRegExp = /Total: [-.0-9]+/g;
const onlyNumberRegExp = /[-.0-9]+/g
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
        //translation = await translation.save();
        res.render(`translated.ejs`, {
            originalCode: inputCode , translatedCode: translatedCode})
    } catch (error) {
        console.log(error);
        res.redirect(`/error`)
    }
    
})

router.post('/translate', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, urlEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})

router.post('/notGlamour', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, GlamourEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})

//Calypso
router.post('/notCalypso', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, CalypsoEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})
//Fuel
router.post('/notFuel', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, FuelEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})
//GT
router.post('/notGt', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, GTEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})
//Iceberg
router.post('/notIceberg', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, IcebergEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})
//Kernel
router.post('/notKernel', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, KernelEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})

//Metacello
router.post('/notMetacello', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, MetacelloEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})

//Morphic
router.post('/notMorphic', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, MorphicEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})
//Refactoring
router.post('/notRefactoring', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, RefactoringEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})
//Seaside
router.post('/notSeaside', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, SeasideEndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})
//Spec2
router.post('/notSpec2', async(req, res)=>{
    const translatedCode = await translateCodeWithouthLinebreaks(req.body.inputCode, Spec2EndpointXMLRPC);
    const translation = new Translation({
        textToTranslate: req.body.inputCode,
        translatedText: translatedCode
      })
      try {
        //const newTranslation = await translation.save()
        res.status(201).set('Content-Type', 'text/html').send(translatedCode);
      } catch (err) {
        res.status(400).send({ message: err.message })
      } 
})


async function queryLanguageModel(lineOfText, languageModelPath){
  let shellCommand = "echo "+lineOfText+" \\ | /root/mosesdecoder/bin/query "+ languageModelPath;
  return new Promise((resolve, reject) => {
    exec(shellCommand, (error, stdout, stderr) => {
    if (error) {
        //console.log(`error: ${error.message}`);
        reject(err)
    }
    else{
      //console.log(`stdout: ${stdout}`);
      resolve(stdout);
    }
    });
  });
}

async function sendLineByLineToLanguageModel(codeSeparatedByLines, pathToLM) {
  let logProbabilities = [];
  for (let index = 0; index < codeSeparatedByLines.length; index++) {
    const lineOfCode = codeSeparatedByLines[index];
    const languageModelResult = await queryLanguageModel(lineOfCode, pathToLM);
    const score = calculateScoreFromResult(languageModelResult);
    logProbabilities.push(score);
  }
  return logProbabilities;
}

function calculateScoreFromResult(lmResult){
  let score = lmResult.match(logProbabilityRegExp);
  let onlyNumber = score[0].match(onlyNumberRegExp);
  let convertedToNumber = parseFloat(onlyNumber[0]);
  return convertedToNumber;
}


async function calculateAverageScore(inputCode, pathToLM) {
  let inputCodeSeparatedByLines = processInputCodeForMoses(inputCode);
  let scoresArray = await sendLineByLineToLanguageModel(inputCodeSeparatedByLines, pathToLM);
  let scoresTotal = 0;
  for (let index = 0; index < scoresArray.length; index++) {
    const element = scoresArray[index];
    scoresTotal += element;
  }
  const scoresAverage = (scoresTotal/(scoresArray.length));
  return scoresAverage;
}

async function translateCodeWithouthLinebreaks(originalCode, port){
    let renamedCode;
    let inputCodeSeparatedByLines = processInputCodeForMoses(originalCode);
    let translatedCodeSeparatedByLines = await sendLineByLineToMoses(inputCodeSeparatedByLines, port);
    renamedCode = translatedCodeSeparatedByLines.join(" ");
    return renamedCode;
}

async function translateCode(originalCode){
    let processedInputCode = processInputCode(originalCode);
    let inputCodeSeparatedByLines = processInputCodeForMoses(originalCode);
    let mapOfVariablesToRename = mapDecompiledCodeVariablesWithPositions(processedInputCode);
    let translatedCodeSeparatedByLines = await sendLineByLineToMoses(inputCodeSeparatedByLines, urlEndpointXMLRPC);
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
async function sendLineByLineToMoses(decompiledCodeSeparatedByLines, port){
        let translatedCode = [];
        let lineOfCode = "";
        for (let index = 0; index < decompiledCodeSeparatedByLines.length; index++) {
            lineOfCode = await sendSimpleXMLRPC(decompiledCodeSeparatedByLines[index], port);
            translatedCode.push(lineOfCode.text);
        }
        return translatedCode;
}

async function sendSimpleXMLRPC(textToTranslate, urlEndpoint){
    let requestObject = [{"text": textToTranslate, "align":"false", "report-all-factors":"false"}];
    return new Promise((resolve, reject) =>{
        xmlrpc.client (urlEndpoint, verb, requestObject, format, async function(err, data) {
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