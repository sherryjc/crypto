
var fs = require('fs');
var lineReader = require('readline');


var b64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

var asciiFreqPoints = [
            -1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0,-1,-1, 0,-1,-1,          // 0x00-0x0f
            -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,          // 0x10-0x1f
            100,1,1,1,1,1,1,1,1,1,1,1,10,1,10,1,                      // 0x20-0x2f
            10,10,10,10,10,10,10,10,10,10,1,1,1,1,1,1,                // 0x30-0x3f
            1,81,15,27,42,127,22,20,61,70,1,7,40,24,67,75,            // 0x40-0x4f
            19,1,59,63,90,27,9,23,1,2,1,1,0,1,0,0,                    // 0x50-0x5f
            1,81,15,27,42,127,22,20,61,70,1,7,40,24,67,75,            // 0x60-0x6f
            19,1,59,63,90,27,9,23,1,2,1,1,0,0,0,-1                    // 0x70-0x7f
];

var utils = {
    'b64idx' : function(idx) {
        if (idx > b64Table.length) {
            console.log("Error: index out of range to b64idx");
        }
        return b64Table[idx];
    },

    'readHex8' : function(infile) {
        var buf = fs.readFileSync(infile);
        var str = buf.toString('binary');
        return utils.hex8ToNumArray(str);
    },

    'readText' : function(infile) {
        var txtbuf = fs.readFileSync(infile);
        var numbuf = new Buffer(txtbuf);
        return numbuf;
    },

    'hex8ToNumArray' : function(inStr) {
        var nPairs = inStr.length/2;
        var extra = inStr.length % 2;
        var outArray = [];
        var ip=0, op=0;
        for (var i=0; i<nPairs; i++) {
            var n1 = parseInt(inStr[ip++], 16);
            var n2 = parseInt(inStr[ip++], 16);
            outArray[op++] = (n1 << 4) + n2;
        }
        if (extra === 1) {
            outArray[op++] = parseInt(inStr[ip++], 16);
        }
        return outArray;
    },

    'hex8ToBase64' : function(buf) {
        var outArr = [];
        var missingChars = buf.length % 3;
        var groups = buf.length / 3;
        var ib = 0, ob = 0;
        for (var i=0; i<groups; i++) {
            var c0 = buf[ib++];
            var c1 = buf[ib++];
            var c2 = buf[ib++];
            outArr[ob++] = utils.b64idx(c0 >>> 2);
            outArr[ob++] = utils.b64idx(((c0 & 0x3) << 4) | (c1 >>> 4));
            outArr[ob++] = utils.b64idx(((c1 & 0xf) << 2) | (c2 >>> 6));
            outArr[ob++] = utils.b64idx((c2 & 0x3f));
        }
        if (missingChars === 1) {
            var c0 = buf[ib++];
            var c1 = buf[ib++];
            outArr[ob++] = utils.b64idx(c0 >>> 2);
            outArr[ob++] = utils.b64idx(((c0 & 0x3) << 4) | (c1 >>> 4));
            outArr[ob++] = utils.b64idx((c1 & 0xf) << 2);
        }
        else if (missingChars === 2) {
            var c0 = buf[ib++];
            outArr[ob++] = utils.b64idx(c0 >>> 2);
            outArr[ob++] = utils.b64idx((c0 & 0x3) << 4);
        }
        return outArr;
    },

    'base64ToNumArray' : function(b64buf) {
        var numArray = [];
        
        return numArray;
    },
    
    'asciiCharRating' : function(idx) {
        if (idx >= asciiFreqPoints.length) {
            return -1;
        }
        return asciiFreqPoints[idx];
    },
    
    'readLinesFromFile' : function(filename, cb) {
        var lineArray = [];
        const rl = lineReader.createInterface({
            input: fs.createReadStream(filename)
        });
        rl.on('line', function(line){
            lineArray.push(line);
        });
        rl.on('close', function(){
            cb(lineArray)
        });
    },

    'encrypt1' : function(buf, key) {
        // Encrypt1: repeating XOR
        var keybuf = new Buffer(key);
        var keylen = keybuf.length;
        var outbuf = [];

        for (var i=0; i<buf.length; i++) {
            outbuf[i] = buf[i] ^ keybuf[i%keylen];
        }
        return outbuf;
    },

    'writeHex' : function(numBuf, outputFile) {
        var outBuf = [];
        for (i=0; i<numBuf.length; i++) {
            outBuf[i] = numBuf[i].toString(16);
            if (numBuf[i] < 16) {
                // prepend leading 0 for single-digit numbers
                outBuf[i] = "0" + outBuf[i];
            }
        }
        var oStr = outBuf.join("");
        fs.writeFileSync(outputFile, oStr);
    },

    'numArrayToText' : function(numBuf, outputFile) {
        var outBuf = [];
        for (i=0; i<numBuf.length; i++) {
            outBuf[i] = String.fromCharCode(numBuf[i]);
        }
        return outBuf.join("");
    },

    'writeNumArrayAsText' : function(numBuf, outputFile) {
        var oStr = utils.numArrayToText(numBuf);
        fs.writeFileSync(outputFile, oStr);
    },

    'countBits' : function(x) {
        var count = 0;
        while (x > 0) {
            if ( (x & 1) === 1 ) {
                count += 1;
            }
            x >>= 1;
        }
        return count;
    },

    'hammingDistanceN' : function(n1, n2) {
        return utils.countBits(n1 ^ n2);
    },

    'hammingDistanceNA' : function(na1, na2) {
        var len = na1.length < na2.length ? na1.length : na2.length;
        var distance = 0;
        for (var i=0; i<len; i++) {
            distance += utils.hammingDistanceN(na1[i], na2[i]);
        }
        return distance;
    },

    'hammingDistanceStr' : function(str1, str2) {
        var numArray1 = new Buffer(str1);
        var numArray2 = new Buffer(str2);
        return utils.hammingDistanceNA(numArray1, numArray2);
    }

};

module.exports = utils;
