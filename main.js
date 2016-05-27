
var util = require('./utils.js');
var fs = require('fs');

// Set 1, Challenge 1
var testHexToB64 = function() {
    var inputFile = './data/set1/challenge1/input.hex';
    var outputFile = './data/set1/challenge1/output.b64';  
    buf = util.readHex8(inputFile);
    var oBuf = util.hex8ToBase64(buf);
    var oStr = oBuf.join("");
    fs.writeFileSync(outputFile, oStr);  
};

// Set 1, Challenge 2
var testFixedXOR = function() {
   var input1 = './data/set1/challenge2/input1.hex';
   var input2 = './data/set1/challenge2/input2.hex';
   var outputFile = './data/set1/challenge2/output.hex';  
   
   var buf1 = util.readHex8(input1);
   var buf2 = util.readHex8(input2);
   if (buf1.length != buf2.length) {
       console.log("Buffer lengths unequal, need to modify algorithm");
   }
   var len = buf1.length < buf2.length ? buf1.length : buf2.length;
   var outArray = [];
   for (var i=0; i<len; i++) {
       outArray[i] = (buf1[i] ^ buf2[i]).toString(16);
  }
   var oStr = outArray.join("");
   fs.writeFileSync(outputFile, oStr);  
};

testHexToB64();
testFixedXOR();
