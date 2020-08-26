var MongoClient = require("mongodb").MongoClient;
var BSON = require("mongodb").BSONPure;
var ObjectId = require("mongodb").ObjectID;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017";
const COLLECTION = "img-metadata";
const BASE_FILE_URL = "/previews/staedel/";
var initiated = false;
var db;

function buildIdObject(id) {
  try {
    return new ObjectId(id);
  } catch (err) {
    return id;
  }
}

exports.getTargetURL = function(filename) {
  return BASE_FILE_URL + filename;
};

exports.initDB = function(dropCollection, callback) {
  MongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database.db = database.db();

    // db.createCollection(COLLECTION, function(err, res) {
    //   if (err) throw err;
    //   console.log("Collection " + COLLECTION + " created on " + url);
    // });
    callback();
  });
};
if (!initiated) {
  this.initDB(null, function() {
    initiated = true;
    console.log("Database created/connected: " + initiated);
  });
}

exports.addObject = function(newObject, okCallback, errCallback) {
  if (newObject) {
    delete newObject._id;
    db.collection(COLLECTION, function(err, collection) {
      collection.insertOne(newObject, { safe: true }, function(
        err,
        dbResponse
      ) {
        if (err) {
          console.log(err);
          errCallback(err);
        } else {
          var createdObject = dbResponse.ops[0];
          okCallback(createdObject);
        }
      });
    });
  } else errCallback(null);
};

exports.findById = function(id, okCallback, errCallback) {
  var self = this;
  db.collection(COLLECTION, function(err, collection) {
    collection.findOne({ _id: buildIdObject(id) }, function(err, item) {
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
  db.collection(COLLECTION, function(err, collection) {
    collection
      .find(query)
      .limit(limit)
      .toArray(function(err, items) {
        if (err) {
          errCallback(err);
        } else {
          okCallback(items);
        }
      });
  });
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
