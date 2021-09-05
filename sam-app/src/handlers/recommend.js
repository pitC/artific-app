let recommendationEngine = require("./app/recommendation-engine")
let Validator = require("jsonschema").Validator,
    recommendSchema = require("./app/schemas/criteriaSchema.json");

let validator = new Validator();

function buildResponse(code, payload) {
    let response = {}
    if (payload) {
        response = {
            statusCode: code,
            body: JSON.stringify(payload),
        };
    }
    else {
        response = {
            statusCode: code,
            body: ""
        }
    }
    console.log(response);
    return response;
}

function recommend(criteria, callback) {
    var valResult = validator.validate(criteria, recommendSchema);
    if (valResult.valid) {
        recommendationEngine.getRecommendation(criteria, function (images) {
            callback(undefined, buildResponse(200, images));
        });
    } else {
        callback(undefined, buildResponse(400, valResult.errors));
    }
}


exports.handler = function (event, context, callback) {
    console.log(event)
    console.log(context)
    
    let requestBody = {}
    if (event.body) {
        requestBody = JSON.parse(event.body)
    }
    
    recommend(requestBody,callback);
};