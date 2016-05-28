
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

// Set 1, Challenge 3

var rate = function(numArray) {
    var score = 0;
    for (var i=0; i<numArray.length; i++) {
        if (numArray[i] >= 0x20 && numArray[i] <= 0x7e ) {
            score++;
        }
    }
    return score;
};

var testSingleByteXOR = function() {
    var input = './data/set1/challenge3/input.hex';
    var inBuf = util.readHex8(input);
    var inBufLen = inBuf.length;
    var highestScore = 0;

    var bestArray = [];
    for (var x=0; x<0xff; x++) {
        var trialArray = [];
        for (var i=0; i<inBufLen; i++) {
            trialArray[i] = (inBuf[i] ^ x);
        }
        var score = rate(trialArray);
        if (score > highestScore) {
            bestArray = trialArray;
        }
    }

    var arrayChars = [];
    for (var i=0; i<bestArray.length; i++) {
        arrayChars[i] = String.fromCharCode(bestArray[i]);
    }

    var str = arrayChars.join("");
    console.log("Decoded string: " + str);
};

//testHexToB64();
//testFixedXOR();

testSingleByteXOR();
