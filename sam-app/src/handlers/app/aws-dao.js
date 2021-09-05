const os = require('os');
const crypto = require('crypto');
const TABLE_NAME = "artific-img-metadata";


let AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-west-2"
});

let docClient = new AWS.DynamoDB.DocumentClient();


function generateId(){
    
    const secondInHex = Math.floor(new Date()/1000).toString(16);
    const machineId = crypto.createHash('md5').update(os.hostname()).digest('hex').slice(0, 6);
    const processId = process.pid.toString(16).slice(0, 4).padStart(4, '0');
    const counter = process.hrtime()[1].toString(16).slice(0, 6).padStart(6, '0');
    return secondInHex + machineId + processId + counter;
}
exports.addObject = function(newObject, okCallback, errCallback) {
  if (newObject) {
    newObject._id = generateId();
  } else errCallback(null);
};

exports.findById = function(id, okCallback, errCallback) {
  let params = {
    Key: {
      _id: id
    },
    TableName:TABLE_NAME
  }
  docClient.get(params,function(err,data){
    if (err){
      errCallback(err);
    }
    else{
      okCallback(data.Item);
    }
  })
};

exports.findByAttribute = function(attribute, value, okCallback, errCallback) {
  var self = this;
  var query = {};
  query[attribute] = value;
  db.collection(COLLECTION, function(err, collection) {
    collection.findOne(query, function(err, item) {
      if (err) {
        errCallback(err);
      } else if (item) {
        // item.fileURL = self.getTargetURL(item.filename);
        okCallback(item);
      } else {
        okCallback(null);
      }
    });
  });
};

let cachedItems = null

exports.findImages = function(criteria, limit, okCallback, errCallback) {
  var query = "";
  // if (criteria.subdomain) {
  //   query = { subdomain: criteria.subdomain };
  // }
  // else if (criteria.collectionFilter){
  //   let re = new RegExp('preview.'+criteria.collectionFilter);
  //   query = {fileURL:re}
  // }
  // else {
  //   query = { subdomain: { $exists: false } };
  // }
  
  let params = {
    TableName:TABLE_NAME
  }
  if (cachedItems){
    console.log("DAO: use cache")
    okCallback(cachedItems);
  
} else{
  docClient.scan(params,function(err,data){
    if (err){
      errCallback(err);
    }
    else{
      cachedItems = data.Items;
      okCallback(data.Items);
    }
  })
}
};

exports.updateImage = function(object, okCallback, errCallback) {
  var id = object._id;
  if (object._id) {
    delete object._id;
  }

  db.collection(COLLECTION, function(err, collection) {
    collection.replaceOne(
      { _id: buildIdObject(id) },
      object,
      { safe: true },
      function(err, dbResponse) {
        if (err) {
          errCallback(err);
        } else {
          if (dbResponse.matchedCount > 0) {
            object._id = id;
            okCallback(object);
          } else {
            // TODO produce valid error object
            errCallback(null);
          }
        }
      }
    );
  });
};
