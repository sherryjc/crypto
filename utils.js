
var fs = require('fs');

var b64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

var asciiFreqPoints = [
            -1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0,-1,-1, 0,-1,-1,    // 0x00-0x0f
            -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,    // 0x10-0x1f
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,                    // 0x20-0x2f
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,                    // 0x30-0x3f
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,                    // 0x40-0x4f
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,                    // 0x50-0x5f
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,                    // 0x60-0x6f
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1                    // 0x70-0x7f
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
    
    'asciiCharRating' : function(idx) {
        if (idx >= asciiFreqPoints.length) {
            return -1;
        }
        return asciiFreqPoints[idx];
    }

};

module.exports = utils;
