var metadataDao = require("./aws-dao");
// const VIBRANCE_SELECTOR = require("./selectors/vibranceSelector");
// const VIBRANCE_MUTED_SELECTOR = require("./selectors/vibranceMutedSelector");
// const PALLETTE_SELECTOR = require("./selectors/paletteSelector");

const WEIGHTED_PALLETTE_METADATA_SELECTOR = require("./selectors/paletteMetadataWeightedSelector");
const colourUtils = require("./colourUtils");
const DEFAULT_SELECTOR = WEIGHTED_PALLETTE_METADATA_SELECTOR;

var selector = null;
var selectors = {
  // "Vibrance only": VIBRANCE_SELECTOR,
  // "Muted and vibrance same weight": VIBRANCE_MUTED_SELECTOR,
  // "Complete palette": PALLETTE_SELECTOR,
  "Weighted metadata palette": WEIGHTED_PALLETTE_METADATA_SELECTOR
};

const DB_FETCH_LIMIT = 5000;
const RECOMMENDATION_LIMIT = 5;

function fetchImages(criteria, callback) {
  metadataDao.findImages(criteria, DB_FETCH_LIMIT, function(images) {
    callback(images);
  });
}

function initSelector(criteria) {
  if (criteria.selector) {
    selector = selectors[criteria.selector] | DEFAULT_SELECTOR;
  } else selector = DEFAULT_SELECTOR;
}

function prepareRecommendation(images, criteria, callback) {
  var recommendations = selector.selectImages(
    RECOMMENDATION_LIMIT,
    criteria,
    images
  );
  callback(recommendations);
}

exports.getSelectors = function() {
  return Object.keys(selectors);
};

function enhancePalette(criteria, callback) {
  // enhance palette with colormind.io
  colourUtils.enhancePalette(criteria.colours, function(enhancedColours) {
    criteria.colours = enhancedColours;
    callback(criteria);
  });
}

function questionsAvailable(criteria) {
  //TODO: add subdomain questions once available
  if (criteria.subdomain != null) {
    return false;
  } else {
    return true;
  }
}

exports.getRecommendation = function(criteria, callback) {
  initSelector(criteria);
  console.log("RECOM ENGINE: start")
  if (criteria.enhance) {
    enhancePalette(criteria, function(enhancedCriteria) {
      console.log("RECOM ENGINE: palette enhanced")
      fetchImages(enhancedCriteria, function(fetchedImages) {
        console.log("RECOM ENGINE: images fetched")
        prepareRecommendation(fetchedImages, enhancedCriteria, function(
          recommendedImages
        ) {
          var response = {
            images: recommendedImages,
            paletteUsed: enhancedCriteria.colours,
            questionsAvailable: questionsAvailable(criteria)
          };
          console.log("RECOM ENGINE: recomm ready")
          callback(response);
        });
      });
    });
  } else {
    fetchImages(criteria, function(fetchedImages) {
      prepareRecommendation(fetchedImages, criteria, function(
        recommendedImages
      ) {
        var response = {
          images: recommendedImages,
          paletteUsed: criteria.colours,
          questionsAvailable: questionsAvailable(criteria)
        };
        callback(response);
      });
    });
  }
};
