"use strict";

const { getWordsDictionary, getCodesByUserInput } = require('./source-data-operations');

async function getWordsByInputLength(length){
  try {
      const wordsDict = await getWordsDictionary();
      const selectedWords = wordsDict.filter( a => {
           return a.split('').length <= length;
      });
      return selectedWords;
  } catch (error) {
      throw error;
  }
}

async function getMatchingWords(inputNumber) {
  return new Promise(async (resolve, reject) => {  
  try {
      
     //Gets codes based on the input numbers
        const inputCodes =  getCodesByUserInput(inputNumber);
        //console.log(inputCodes);

      //Gets words from the dictionary whose length is less than input value
        const inputLength = inputNumber.toString().split('').length;
        const wordsSelected = await getWordsByInputLength(inputLength);
       
        //loop through each word to find it exists in any of the input codes.
          const finalValues = [];
          
          wordsSelected.forEach( word => {
            
              const wordLetters = word.split('');
              const innerValues = [];
             
             
              for(let i = 0; i < wordLetters.length; i++){  
                  let letter = wordLetters[i];  
                 for(let j = 0; j < inputCodes.length; j++){                      
                      let inputCode = inputCodes[j];
                      //console.log(inputCode);
                      let rgxp = new RegExp(letter, "i");
                      //console.log(xxx.match(rgxp));
                      let valueMatch = inputCode.value.match(rgxp);
                      if(valueMatch != null){
                          if(valueMatch.length == 1){                           
                          const finalResult = {};
                          finalResult.digit = inputCode.digit;
                          finalResult.value = inputCode.value;
                          finalResult.letter = letter.toUpperCase();
                          finalResult.word = word;
                          innerValues.push(finalResult);                           
                          break;
                          }
                      }
                 }
              }
          if(innerValues.length > 1)
              finalValues.push(innerValues);
       });  
       //console.log(finalValues);     
       resolve(finalValues);    
  }
  catch (error) {
      reject(error);
      
  }
});
}

async function getDigitWordMappings(inputNumber) {
  return new Promise(async (resolve, reject) => {  
  try {
      const results = await getMatchingWords(inputNumber);
      //console.log(results);
      const finals = [];
      results.forEach(result =>{
          let number = inputNumber;
          const digitsPattern = result.map(r => r.digit).join("");
          let wordPattern = result.map(r => r.letter).join("");
          const word = result.map(r => r.word)[0];
         
          if(wordPattern == word.toString().toUpperCase()){
              //console.log()
              wordPattern = "-" + wordPattern + "-";
              const final = number.toString().replace(digitsPattern,wordPattern);
              //console.log(final);
              if(final != number)
              {                   
                      finals.push({digits:digitsPattern, words:wordPattern, finalResult:final});
              }
          }       

      });
      resolve(finals);
  } catch (error) {
      //console.log(error);
      reject(error);
  }
});
}

async function covertPhoneNumberToWords(inputNumber) {
    return new Promise(async (resolve, reject) => {    
    try {
        const allresults = [];
        const results = await getDigitWordMappings(inputNumber);        
        //console.log(results);

        const finalResults = results.map(r => r.finalResult);
        //console.log(finalResults);

        finalResults.forEach(res =>{
            const vals = res.split("-");
            for(let i = 0; i < vals.length; i++){
                const v = vals[i];
                const res_1 = results.filter( r => r.digits == v);
                if(res_1.length > 1){
                    //console.log(res_1);
                    res_1.forEach( r => {
                        //const v1 = r.words.toString().replace("-","");
                        const v1 = r.words;
                        //console.log(v1);
                        const re = res.toString().replace(v,v1);
                       // var result = re.substr(1).slice(0, -1);
                        //console.log(re);
                        //console.log("Contains");
                    if(!allresults.includes(re))
                        allresults.push(re);

                    })
                }
                else{
                    
                    //console.log("Does not contain");
                    if(!allresults.includes(res))
                        allresults.push(res);
                    //console.log(res);
                    //break;                    
                }
            }
                       

        });

        //if(allresults.length != 0)
        const val = allresults.map(v => {
            let tr = v.replace("--","-");
            let hyp_first = tr.substr(0,1);
            let hyp_last = tr.slice(-1);

             if(hyp_first == '-' ){
                 tr = tr.substr(1, tr.length);
              }
              if(hyp_last == '-' ){
                tr = tr.substr(0, tr.length - 1);
             }
            
            return tr;
        }).join(",");            

         resolve(val);
        
    } catch (error) {
        reject(error);
    }
});
}

module.exports = {covertPhoneNumberToWords};
