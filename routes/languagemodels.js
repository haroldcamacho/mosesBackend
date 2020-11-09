const express = require('express');
const router = express.Router();
const { exec } = require("child_process");
const TextUtils = require('../bussinessLogic/textUtils.js');
const onlyNumberRegExp = /[-.0-9]+/g
const logProbabilityRegExp = /Total: [-.0-9]+/g;

router.post('/align', async(req, res)=>{
    let inputCode = req.body.inputCode;
    let result = await calculateAverageScore(inputCode,'/root/lmPharo/pharo.dec-ori.blm.ori');
    console.log("RESULT: ", result);
    
    // let aux = await queryLanguageModel(inputCode, '/root/lmPharo/pharo.dec-ori.blm.ori')
    // let score = aux.match(logProbabilityRegExp);
    // console.log("SCORE: ", score);
    // let onlyNumber = score[0].match(onlyNumberRegExp);
    // console.log("ONLY NUMBER: ", onlyNumber[0]);
    // let converted = parseFloat(onlyNumber[0]);
    // console.log("CONVERTED: ", converted);
    res.send(`received`)
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


module.exports = router