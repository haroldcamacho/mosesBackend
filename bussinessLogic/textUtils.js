const specialCharactersRegex = /[^0-9a-zA-Z]/g;
const variablesRegExp = /\barg[0-9]\b|\btmp[0-9]\b/;
const extraSpaceRegExp = /  +/g;

exports.storeVariablesInDictionary = (map, key, value) => {
    key = deleteSpecialCharactersFromVariables(key);
    if (!map.has(key)) {
        map.set(key, [value]);
        return;
    }
    map.get(key).push(value);
}

exports.concatenateTranslatedLines = (translatedCode) => {
    let processedCode = translatedCode.join(' ');
    return processedCode;
}


exports.separateCodeInLinesByWords = (arrayOfLines) => {
    let processedCode = arrayOfLines.join(' ');
    processedCode = processedCode.trim();
    processedCode = processedCode.split(' ');
    processedCode = deleteWhitespacesFromArray(processedCode)
    return processedCode;
}


exports.processInputCodeForMoses = (inputCode) => {
    let processedCode = deleteTabSpaces(inputCode);
    processedCode = divideCodeByLines(processedCode);  
    const cleanedCode = deleteExtraSpacesFromCodeArray(processedCode);  
    return cleanedCode;
}


exports.separateBySpaceCharacter = (code) =>{
    return code.split(' ');
}

exports.deleteLineBreaksFromText = (code) =>{
    return code.replace(/\r\n|\r|\n/gm, ' ');
}


exports.deleteWhitespacesFromArray = (code) =>{
    return code.filter(item => item.trim() !== '');
}

exports.isVariableToRename = (code) => {
    return (variablesRegExp.test(code));
}

function deleteSpecialCharactersFromVariables(code){
    return (code.replace(specialCharactersRegex,''));
}

const deleteTabSpaces = (code) =>{
    return code = code.replace(/\t/g, '');
}

const deleteExtraSpaceCharacterFromString = (code) =>{
    const cleanedCode = code.replace(extraSpaceRegExp, ' ');
    return cleanedCode;
}

const deleteExtraSpacesFromCodeArray = (codeArray) => {
    let cleanedCodeArray = [];
    for (let index = 0; index < codeArray.length; index++) {
        let element = codeArray[index];
        element = deleteExtraSpaceCharacterFromString(element);
        cleanedCodeArray.push(element);
    }
    return cleanedCodeArray;
}

const divideCodeByLines = (code) => {
    return code.trim().split(/\r\n|\r|\n/g);
}