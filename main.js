
var util = require('./utils.js');
var fs = require('fs');

// Set 1, Challenge 1
var testHexToB64 = function() {
    var inputFile = './data/set1/challenge1/input.hex';
    var outputFile = './data/set1/challenge1/output.b64';  
    var buf = util.readHex8(inputFile);
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
        var cRating = util.asciiCharRating(numArray[i]);
        if (cRating < 0) {
            return 0;
        }
        else {
            score += cRating;
        }
    }
    return (score*100)/numArray.length;
};

var testBinWrite = function() {
    var inputFile = './data/set1/challenge1/input.hex';
    var outputFile = './data/set1/challenge1/output.bin';  
    var inBuf = util.readHex8(inputFile);
    var rawBuf = new Buffer(inBuf, 'binary');
    //console.log(rawBuf);
    fs.writeFileSync(outputFile, rawBuf);
};

var numArrayToStr = function(numArr) {
    var arrayChars = [];
    for (var i=0; i<numArr.length; i++) {
        arrayChars[i] = String.fromCharCode(numArr[i]);
    }
    var str = arrayChars.join("");
    return str;
};

var testSingleByteXOR = function() {
    var input = './data/set1/challenge3/input.hex';
    var inBuf = util.readHex8(input);
    var inBufLen = inBuf.length;
    var highestScore = 0;

    var bestArray = [];
    for (var x=0; x<=0xff; x++) {
        var trialArray = [];
        for (var i=0; i<inBufLen; i++) {
            trialArray[i] = (inBuf[i] ^ x);
        }
        var str = numArrayToStr(trialArray);
        var score = rate(trialArray);
        if (score > 0) {
          console.log(x + ": rating="+score+" " + str);          
        }
        if (score > highestScore) {
            bestArray = trialArray;
        }
    }

    var decodedStr = numArrayToStr(bestArray);
    //console.log("Decoded string: " + decodedStr);
};

//testHexToB64();
//testFixedXOR();

testSingleByteXOR();
//testBinWrite();
