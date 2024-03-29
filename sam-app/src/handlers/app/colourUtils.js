const colorConvert = require("color-convert");
const deltaE = require("delta-e");
const request = require("request");
const COLORMIND_API = "http://colormind.io/api/";
const COLORMIND_ARRAY_SIZE = 5;
const COLORMIND_EMPTY_COLOUR = "N";
const COLORMIND_TIMEOUT = 1500;
var DELTA_MAX_DISTANCE = 100;

exports.convertToLabObject = function(hex) {
  var strippedHex = hex.replace("#", "");
  var labArray = colorConvert.hex.lab(strippedHex);
  var labObject = {
    L: labArray[0],
    A: labArray[1],
    B: labArray[2]
  };
  return labObject;
};

function convertHexToRGB(hex) {
  var strippedHex = hex.replace("#", "");
  var rgb = colorConvert.hex.rgb(strippedHex);
  return rgb;
}
function convertRgbToHex(rgb) {
  var hex = colorConvert.rgb.hex(rgb);
  return "#" + hex;
}

exports.getDistance = function(firstColour, secondColour) {
  var distance = DELTA_MAX_DISTANCE;
  if (firstColour && secondColour) {
    try {
      var firstColourLAB = this.convertToLabObject(firstColour);
      var secondColourLAB = this.convertToLabObject(secondColour);
      distance = deltaE.getDeltaE00(firstColourLAB, secondColourLAB);
    } catch (err) {
      console.log(err);
    }
  }
  return parseFloat(distance);
};

exports.getMinDistance = function(firstColours, secondColours) {
  var minDistance = DELTA_MAX_DISTANCE;
  for (firstIndex in firstColours) {
    for (secondIndex in secondColours) {
      var currDistance = this.getDistance(
        firstColours[firstIndex],
        secondColours[secondIndex]
      );
      if (currDistance < minDistance) {
        minDistance = currDistance;
      }
    }
  }
  return minDistance;
};

function getColormindReqeust(colours) {
  // request example: {"input":[[114,92,76],"N","N","N","N"],"model":"default"}
  var rgbColours = colours.map(convertHexToRGB);
  var delta = rgbColours.length - COLORMIND_ARRAY_SIZE;
  while (delta++ < 0) {
    rgbColours.push(COLORMIND_EMPTY_COLOUR);
  }

  var jsonData = { input: rgbColours, model: "default" };
  return jsonData;
}
function processColormindResponse(body) {
  // response example: {"result":[[115,91,77],[168,159,154],[190,132,112],[176,136,122],[177,141,84]]}
  var hexColours = body.result.map(convertRgbToHex);
  return hexColours;
}

exports.enhancePalette = function(colours, callback) {
  var jsonData = getColormindReqeust(colours);
  var returnPalette = colours;
  request(
    {
      url: COLORMIND_API,
      method: "POST",
      json: jsonData,
      timeout: COLORMIND_TIMEOUT
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        returnPalette = processColormindResponse(body);
      }
      callback(returnPalette);
    }
  );
};
//
exports.getWeightedAverageDistance = function(
  inputColours,
  sourceColours,
  weights
) {
  var minDistance = DELTA_MAX_DISTANCE;
  var sumDistance = 0;
  var calcLog = {};
  for (inpIndex in inputColours) {
    minDistance = DELTA_MAX_DISTANCE;
    var inputColour = inputColours[inpIndex];
    var weight = weights[inpIndex];
    for (srcIndex in sourceColours) {
      var sourceColour = sourceColours[srcIndex];
      var currDistance = DELTA_MAX_DISTANCE;
      if (inputColour !== null && sourceColour !== null) {
        currDistance = this.getDistance(inputColour, sourceColour);
      }
      if (calcLog[sourceColour]) {
        calcLog[sourceColour].push(currDistance.toFixed(0));
      } else {
        calcLog[sourceColour] = [currDistance.toFixed(0)];
      }
      if (currDistance < minDistance) {
        minDistance = currDistance;
      }
    }
    var minDistanceWeighted = minDistance * weight;

    sumDistance = sumDistance + minDistanceWeighted;
  }
  if (inputColours.length > 0) {
    var weightSum = weights.reduce((a, b) => a + b, 0);
    var averageDistance = sumDistance / weightSum;
    return [averageDistance, calcLog];
  } else {
    return [DELTA_MAX_DISTANCE, calcLog];
  }
};

exports.getAverageDistance = function(inputColours, sourceColours) {
  var minDistance = DELTA_MAX_DISTANCE;
  var sumDistance = 0;
  var calcLog = {};
  for (inpIndex in inputColours) {
    minDistance = DELTA_MAX_DISTANCE;
    var inputColour = inputColours[inpIndex];
    for (srcIndex in sourceColours) {
      var sourceColour = sourceColours[srcIndex];
      var currDistance = DELTA_MAX_DISTANCE;
      if (inputColour !== null && sourceColour !== null) {
        currDistance = this.getDistance(inputColour, sourceColour);
      }
      if (calcLog[sourceColour]) {
        calcLog[sourceColour].push(currDistance.toFixed(0));
      } else {
        calcLog[sourceColour] = [currDistance.toFixed(0)];
      }
      if (currDistance < minDistance) {
        minDistance = currDistance;
      }
    }
    sumDistance = sumDistance + minDistance;
  }
  if (inputColours.length > 0) {
    var averageDistance = sumDistance / inputColours.length;
    return [averageDistance, calcLog];
  } else {
    return [DELTA_MAX_DISTANCE, calcLog];
  }
};
