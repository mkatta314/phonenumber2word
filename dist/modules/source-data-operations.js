"use strict";

const fs = require('fs');
const config = require("config");
const highland = require('highland');

async function getWordsDictionary() {
    return new Promise((resolve, reject) => {  
    try {
          
        const readStream = fs.createReadStream("dist/words-dictionary.txt");    

        readStream.on('error', function (error) {
            console.log("Error reading", error);
           // logger.default.error(error);
            process.exit(1);
        });
        readStream.on('readable', function () {
            highland(readStream)
            .split()            
            .compact()
            .toArray((lines) => {
            resolve(lines);
        });
        });
        
    }
    catch (error) {          
        reject(error);        
    }
});
}

function getCodesByUserInput(inputNumber){
    try {
            const inputs = inputNumber.toString().split('');
            const inputCodes = [];
            inputs.forEach(i => { 
                inputCodes.push( getCodeByDigit(parseInt(i)));
            });
            return inputCodes;
    } catch (error) {
        throw error;
    }
  }

function getCodeByDigit(digit){
    try {
        if(digit > 1 && digit < 10){
            const numberCodesSource = config.get("NumberCodes");
            const val = numberCodesSource.filter(a => { return a.digit === digit;})[0];
            return val;
        }
        else{
            return "";
        }
    } catch (error) {
        throw error;
    }

}

module.exports = {getWordsDictionary, getCodesByUserInput};
