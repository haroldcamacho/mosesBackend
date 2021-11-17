//Backend before not projects
const express = require('express');
const router = express.Router();
const { exec } = require("child_process");
require('dotenv').config()

const TextUtils = require('../bussinessLogic/textUtils.js');
const onlyNumberRegExp = /[-.0-9]+/g
const logProbabilityRegExp = /Total: [-.0-9]+/g;
const PharoLanguageModel = process.env.PHARO_LM;
const GlamourLanguageModel = process.env.GLAMOUR_LM;
const Spec2LanguageModel = process.env.SPEC2_LM;
const CalypsoLanguageModel = process.env.CALYPSO_LM;
const FuelLanguageModel = process.env.FUEL_LM;
const IcebergLanguageModel = process.env.ICEBERG_LM;
const KernelLanguageModel = process.env.KERNEL_LM;
const MorphicLanguageModel = process.env.MORPHIC_LM;
const RefactoringLanguageModel = process.env.REFACTORING_LM;
const GTLanguageModel = process.env.GT_LM;
const MetacelloLanguageModel = process.env.METACELLO_LM;
const SeaSideLanguageModel = process.env.SEASIDE_LM;
const RoassalLanguageModel = process.env.ROASSAL_LM;

router.post('/pharo', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, PharoLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/glamour', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, GlamourLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/spec2', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, Spec2LanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/calypso', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, CalypsoLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/fuel', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, FuelLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/iceberg', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, IcebergLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/kernel', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, KernelLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/morphic', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, MorphicLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/refactoring', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, RefactoringLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/gt', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, GTLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/metacello', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, MetacelloLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/seaside', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, SeaSideLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

router.post('/roassal', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode, RoassalLanguageModel);
    res.status(200).send(JSON.stringify(result));
})

function calculateScoreFromResult(lmResult){
let score = lmResult.match(logProbabilityRegExp);
let onlyNumber = score[0].match(onlyNumberRegExp);
let convertedToNumber = parseFloat(onlyNumber[0]);
return convertedToNumber;
}

async function calculateAverageScore(inputCode, pathToLM) {
let inputCodeSeparatedByLines = TextUtils.processInputCodeForMoses(inputCode);
let scoresArray = await sendLineByLineToLanguageModel(inputCodeSeparatedByLines, pathToLM);
let scoresTotal = 0;
for (let index = 0; index < scoresArray.length; index++) {
    const element = scoresArray[index];
    scoresTotal += element;
}
const scoresAverage = (scoresTotal/(scoresArray.length));
return scoresAverage;
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

async function queryLanguageModel(lineOfText, languageModelPath){
let shellCommand = 'echo '+'"'+lineOfText+'"'+' \\ | /root/mosesdecoder/bin/query '+ languageModelPath;
return new Promise((resolve, reject) => {
    exec(shellCommand, (error, stdout, stderr) => {
    if (error) {
        //console.log(`error: ${error.message}`);
        reject(error)
    }
    else{
        //console.log(`stdout: ${stdout}`);
    resolve(stdout);
    }
    });
});
}


module.exports = router