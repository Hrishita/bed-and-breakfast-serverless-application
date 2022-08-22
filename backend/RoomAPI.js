const AWS = require('aws-sdk');
const s3 = new AWS.S3();
AWS.config.update({
    region: 'us-east-1'
});
const bucketName = 's3-room-images';
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName= 'Room';
const healthPath = '/health';
const roomPath = '/room';
const roomsPath = '/rooms';

exports.handler = async (event) => {
    console.log('Request event: ',event);
    console.log('Request eventPath: ',event.routeKey.split(" ")[1]);
    console.log('Request eventhttpMethod: ',event['requestContext']['http']['method']);
    var httpMethod = event.routeKey.split(" ")[0];
    var path = event.routeKey.split(" ")[1];
    let response;
    switch(true){
        case event['requestContext']['http']['method'] === 'GET' && path === healthPath:
            response = buildResponse(201,'Hello health');
            break;
        case event['requestContext']['http']['method'] === 'GET' && path === roomPath:
            response = await getRoom(event.queryStringParameters.RoomId);
            break;
        case event['requestContext']['http']['method'] === 'POST' && path === roomPath:
            response = await saveRoom(JSON.parse(event.body));
            break;
        case event['requestContext']['http']['method'] === 'PATCH' && path === roomPath:
            const requestBody = JSON.parse(event.body);
            response = await updateRoom(requestBody.RoomId, requestBody.updateKey, requestBody.updateValue);
            break;
        case event['requestContext']['http']['method'] === 'DELETE' && path === roomPath:
            response = await deleteRoom(event.queryStringParameters.RoomId);
            break;
        case event['requestContext']['http']['method'] === 'GET' && path === roomsPath:
            response = await getRooms();
            break;
        default:
            response = buildResponse(404, '404 Not Found !!');
    }
    return response; 
};

async function getRoom(RoomId){
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'RoomId': Number(RoomId)
        }
    }
    return await dynamodb.get(params).promise().then((response) =>{
        const body = {
            Operation: 'GET',
            Status: 'true',
            Message: 'Files fetched Successfully !!',
            Data: response.Item
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('getRoom :',error);
    });
}

async function getRooms(){
    const params = {
        TableName: dynamodbTableName
    }
    const allRooms = await scanDynamoRecords(params, []);
    const body = {
        Operation: 'GET',
        Status: 'true',
        Message: 'Files fetched Successfully !!',
        Data: allRooms
    }
    return buildResponse(201, body);
}

async function scanDynamoRecords(scanParams, itemArray){
    try{
        const dynamoData= await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if(dynamoData.LastEvaluatedKey){
            scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
            return await scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;
    } catch(error){
        console.error('scanDynamoRecords :',error);
    }
}

async function saveRoom(requestBody){
    
    if(requestBody.RoomImage!="")
     {
        var imagetype=requestBody.RoomImage.split(";")[0].split("/")[1];
        //console.log("imagetype",imagetype);
        const decodeFile= Buffer.from(requestBody.RoomImage.replace(/^data:image\/\w+;base64,/,""),"base64");
        const S3params = {
                Bucket:bucketName,
                Key: requestBody.RoomId + '-' + Date.now()+ '.'+ imagetype,
                Body: decodeFile,
                ACL:'public-read'
              };
        var result = await s3.upload(S3params).promise()
        requestBody.RoomImage=result.Location;
     }
    const params = {
        TableName: dynamodbTableName,
        Item: requestBody
    }
    return await dynamodb.put(params).promise().then((response) =>{
        const body = {
            Operation: 'SAVE',
            Status: 'true',
            Message: 'Room saved Successfully !!',
            Data: requestBody
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('saveRoom :',error);
    });
}

async function updateRoom(RoomId, updateKey, updateValue){
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'RoomId': Number(RoomId)
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues:{
            ':value': updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then((response) =>{
        const body = {
            Operation: 'UPDATE',
            Status: 'true',
            Message: 'Room updated Successfully !!',
            Data: response
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('updateRoom :',error);
    });
}

async function deleteRoom(RoomId){
     console.log('deleteRoom :',RoomId);
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'RoomId': Number(RoomId)
        },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) =>{
        const body = {
            Operation: 'DELETE',
            Status: 'true',
            Message: 'Room deleted Successfully !!',
            Data: response
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('deleteRoom :',error);
    });
}

function buildResponse(statusCode , body){
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type':'application/json',
             "Access-Control-Allow-Origin" : "*",
        },
        body: JSON.stringify(body)
    }
}
