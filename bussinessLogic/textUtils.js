const specialCharactersRegex = /[^0-9a-zA-Z]/g;
const variablesRegExp = /\barg[0-9]\b|\btmp[0-9]\b/;

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
    return processedCode;
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

const divideCodeByLines = (code) => {
    return code.trim().split(/\r\n|\r|\n/g);
}