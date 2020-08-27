let metadataDao = require("aws-dao");
// let metadataDao = require("./../../db_migration/aws-dao")

function buildResponse(code,payload){
    let response = {}
    if (payload){
        response = {
            statusCode: code,
            body: JSON.stringify(payload),
        };
    }
    else{
        response = {
            statusCode:code,
            body:""
        }
    }
    console.log(response);
    return response;
}

function getImage(request,callback){
    metadataDao.findById(request,function(data){
        if (data){
            console.log(data);
            callback(undefined,buildResponse(200,data));
        }
        else{
            callback(undefined,buildResponse(404,null));
        }
    },function(err){
        console.error(err);
        callback(buildResponse(500,null));
    }
    );
}

exports.handler = function(event,context,callback) {
    console.log(event)
    getImage(event.pathParameters["id"]||null,callback)
    //callback(undefined,{statusCode:200,body:JSON.stringify(event)});
};
getImage("5bfc5d5d6ba9b622d2aff9e5");