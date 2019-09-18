process.env.NODE_ENV = 'localDevelopment';
const should = require('should');
const { getWordsDictionary } = require('../dist/modules/source-data-operations');
const { covertPhoneNumberToWords } = require('../dist/modules/word-mappings');



describe('Source Data', () => {
    it('fetching words dictionary', (done) => {
        getWordsDictionary().then((result) => {
        should(result.length).not.equal(0);
        done();
      }).catch((e) => {
        done(e);
      });
    }); 

    it('Returns matching words', (done) => {
        covertPhoneNumberToWords(35853).then((result) => {
        should(result).equal("FLUKE,3-LUKE,35-UKE");
        done();
      }).catch((e) => {
        done(e);
      });
    }); 

  });