'use strict';

const handler = async (event) => {
    return {
        "statusCode": 200,
        "headers": {
            "Authorization": "XYZ"
        },
        "body": JSON.stringify({ "message": `Hello, ${event.queryStringParameters.name}` }),
        "isBase64Encoded": false
    };
}

module.exports = {
    handler
}