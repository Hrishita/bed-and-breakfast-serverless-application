const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName= 'Facilities';
const healthPath = '/health';
const facilityPath = '/facility';
const facilitiesPath = '/facilities';

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
        case event['requestContext']['http']['method'] === 'GET' && path === facilityPath:
            response = await getFacility(event.queryStringParameters.FacilityId);
            break;
        case event['requestContext']['http']['method'] === 'POST' && path === facilityPath:
            response = await saveFacility(JSON.parse(event.body));
            break;
        case event['requestContext']['http']['method'] === 'PATCH' && path === facilityPath:
            const requestBody = JSON.parse(event.body);
            response = await updateFacility(requestBody.FacilityId, requestBody.updateKey, requestBody.updateValue);
            break;
        case event['requestContext']['http']['method'] === 'DELETE' && path === facilityPath:
            response = await deleteFacility(event.queryStringParameters.FacilityId);
            break;
        case event['requestContext']['http']['method'] === 'GET' && path === facilitiesPath:
            response = await getFacilities();
            break;
        default:
            response = buildResponse(404, '404 Not Found !!');
    }
    return response; 
};

async function getFacility(FacilityId){
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'FacilityId': Number(FacilityId)
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
        console.error('getFacility :',error);
    });
}

async function getFacilities(){
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

async function saveFacility(requestBody){
    const params = {
        TableName: dynamodbTableName,
        Item: requestBody
    }
    return await dynamodb.put(params).promise().then((response) =>{
        const body = {
            Operation: 'SAVE',
            Status: 'true',
            Message: 'Facility saved Successfully !!',
            Data: requestBody
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('saveFacility :',error);
    });
}

async function updateFacility(FacilityId, updateKey, updateValue){
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'FacilityId': Number(FacilityId)
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
            Message: 'Facility updated Successfully !!',
            Data: response
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('updateFacility :',error);
    });
}

async function deleteFacility(FacilityId){
     console.log('deleteFacility :',FacilityId);
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'FacilityId': Number(FacilityId)
        },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) =>{
        const body = {
            Operation: 'DELETE',
            Status: 'true',
            Message: 'Facility deleted Successfully !!',
            Data: response
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('deleteFacility :',error);
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