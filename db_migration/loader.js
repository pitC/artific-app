let mongoDB = require ("./metadata-dao");
require("dotenv").config();
let AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-west-2"
});

let docClient = new AWS.DynamoDB.DocumentClient();
console.log(process.env.MONGODB_URI);

var table = "artific-img-metadata";

// console.log(env);
mongoDB.initDB(false, function() {

    mongoDB.findImages({subdomain:"pitc"}, 2000, function(images){
        
        for (var index in images){
            var imageData = images[index];
            imageData._id = imageData._id.toString();
            let params = {
                TableName: table,
                Item: imageData
            }
            docClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                }
            });

        }
        
    }, function(){
        null;
    }); 

});