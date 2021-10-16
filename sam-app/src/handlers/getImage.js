let metadataDao = require("./app/aws-dao");

function buildResponse(code,payload){
    let response = {}
    if (payload){
        response = {
            statusCode: code,headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(payload),
        };
    }
    else{
        response = {
            statusCode:code,headers: {
                'Access-Control-Allow-Origin': '*'
            },
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
    let imageId = null
    if (event.pathParameters){
        imageId = event.pathParameters["id"]||null
    }
    getImage(imageId,callback)
    //callback(undefined,{statusCode:200,body:JSON.stringify(event)});
};
// getImage("5bfc5d5d6ba9b622d2aff9e5");