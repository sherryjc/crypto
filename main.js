
var fs = require('fs');

var b64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

var b64idx = function(idx) {
    if (idx > b64Table.length) {
        console.log("Error: index out of range to b64idx");
    }
    return b64Table[idx];
};

var readHex8 = function(infile) {
     var buf = fs.readFileSync(infile);
     var str = buf.toString('binary');
     var nPairs = str.length/2;
     var extra = str.length % 2;
     var outArray = [];
     var ip=0, op=0;
     for (var i=0; i<nPairs; i++) {
         var n1 = parseInt(str[ip++], 16);
         var n2 = parseInt(str[ip++], 16);
         outArray[op++] = (n1 << 4) + n2;
     }
     if (extra === 1) {
         outArray[op++] = parseInt(str[ip++], 16);
     }
     return outArray;
};

var hex8ToBase64 = function(buf) {
    var outArr = [];
    var missingChars = buf.length % 3;
    var groups = buf.length / 3;
    var ib = 0, ob = 0;
    for (var i=0; i<groups; i++) {
        var c0 = buf[ib++];
        var c1 = buf[ib++];
        var c2 = buf[ib++];
        outArr[ob++] = b64idx(c0 >>> 2);
        outArr[ob++] = b64idx(((c0 & 0x3) << 4) | (c1 >>> 4)); 
        outArr[ob++] = b64idx(((c1 & 0xf) << 2) | (c2 >>> 6));
        outArr[ob++] = b64idx((c2 & 0x3f));
    }
    if (missingChars === 1) {
        var c0 = buf[ib++];
        var c1 = buf[ib++];
        outArr[ob++] = b64idx(c0 >>> 2);
        outArr[ob++] = b64idx(((c0 & 0x3) << 4) | (c1 >>> 4)); 
        outArr[ob++] = b64idx((c1 & 0xf) << 2);
    }
    else if (missingChars === 2) {
        var c0 = buf[ib++];        
        outArr[ob++] = b64idx(c0 >>> 2);
        outArr[ob++] = b64idx((c0 & 0x3) << 4); 
    }
    return outArr;
};

// Set 1, Challenge 1
var testHexToB64 = function() {
    var inputFile = './data/set1/challenge1/input.hex';
    var outputFile = './data/set1/challenge1/output.b64';  
    buf = readHex8(inputFile);
    var oBuf = hex8ToBase64(buf);
    var oStr = oBuf.join("");
    fs.writeFileSync(outputFile, oStr);  
};

// Set 1, Challenge 2
var testFixedXOR = function() {
   var input1 = './data/set1/challenge2/input1.hex';
   var input2 = './data/set1/challenge2/input2.hex';
   var outputFile = './data/set1/challenge2/output.hex';  
   
   var buf1 = readHex8(input1);
   var buf2 = readHex8(input2);
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
