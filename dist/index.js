"use strict";

const yargs_parser_1 = require("yargs-parser");
const { covertPhoneNumberToWords } = require('./modules/word-mappings');

//Read the command line arguments
let argv = yargs_parser_1(process.argv.slice(2));

if (!argv.number) {
    console.log("Input must be provided");
}
else
{
    
    covertPhoneNumberToWords(argv.number).then((data) => {
        
        console.log(data);
        console.log("Completed!!!");
        //process.exit(0);
    })
};

