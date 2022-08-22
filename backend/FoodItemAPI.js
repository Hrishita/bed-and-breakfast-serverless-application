const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName= 'FoodItem';
const healthPath = '/health';
const roomtypePath = '/fooditem';
const roomtypesPath = '/fooditems';

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
        case event['requestContext']['http']['method'] === 'GET' && path === roomtypePath:
            response = await getRoomType(event.queryStringParameters.ItemId);
            break;
        case event['requestContext']['http']['method'] === 'POST' && path === roomtypePath:
            response = await saveRoomType(JSON.parse(event.body));
            break;
        case event['requestContext']['http']['method'] === 'PATCH' && path === roomtypePath:
            const requestBody = JSON.parse(event.body);
            response = await updateRoomType(requestBody.ItemId, requestBody.updateKey, requestBody.updateValue);
            break;
        case event['requestContext']['http']['method'] === 'DELETE' && path === roomtypePath:
            response = await deleteRoomType(event.queryStringParameters.ItemId);
            break;
        case event['requestContext']['http']['method'] === 'GET' && path === roomtypesPath:
            response = await getRoomTypes();
            break;
        default:
            response = buildResponse(404, '404 Not Found !!');
    }
    return response; 
};

async function getRoomType(ItemId){
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'ItemId': Number(ItemId)
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
        console.error('getRoomType :',error);
    });
}

async function getRoomTypes(){
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

async function saveRoomType(requestBody){
    const params = {
        TableName: dynamodbTableName,
        Item: requestBody
    }
    return await dynamodb.put(params).promise().then((response) =>{
        const body = {
            Operation: 'SAVE',
            Status: 'true',
            Message: 'Food Item saved Successfully !!',
            Data: requestBody
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('saveRoomType :',error);
    });
}

async function updateRoomType(ItemId, updateKey, updateValue){
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'ItemId': Number(ItemId)
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
            Message: 'Food Item updated Successfully !!',
            Data: response
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('updateRoomType :',error);
    });
}

async function deleteRoomType(ItemId){
     console.log('deleteRoomType :',ItemId);
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'ItemId': Number(ItemId)
        },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) =>{
        const body = {
            Operation: 'DELETE',
            Status: 'true',
            Message: 'Food Item deleted Successfully !!',
            Data: response
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('deleteRoomType :',error);
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