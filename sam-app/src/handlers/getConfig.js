function buildResponse(request){
    var arConfig = {}
    arConfig['frameConfig'] = {
        renderMat: true,
        showFrame:true,
        depth: 0.1,
        width: 0.02,
        matPad: 0.2,
        frameColour: "#fcf0d1",
        matColour: "#fcf0d1"
    }
    // TODO: include subdomains
    // if (subdomain == "wwieteska"){
    //     arConfig.frameConfig.renderMat = false;
    //     arConfig.frameConfig.showFrame = false;
    // }
    let response = {
        statusCode: 200,
        body: JSON.stringify(arConfig),
    };
    return response;
}

exports.arConfigHandler = async (event) => {
    console.log(event)
    let response = buildResponse(event);
    return response;
};