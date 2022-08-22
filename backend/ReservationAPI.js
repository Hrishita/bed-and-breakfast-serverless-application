const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName= 'Reservation';
const healthPath = '/health';
const reservationPath = '/reservation';
const reservationsPath = '/reservations';

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
        case event['requestContext']['http']['method'] === 'GET' && path === reservationPath:
            response = await getReservation(event.queryStringParameters.ReservationId);
            break;
        case event['requestContext']['http']['method'] === 'POST' && path === reservationPath:
            response = await saveReservation(JSON.parse(event.body));
            break;
        case event['requestContext']['http']['method'] === 'PATCH' && path === reservationPath:
            const requestBody = JSON.parse(event.body);
            response = await updateReservation(requestBody.ReservationId , requestBody.updateKey, requestBody.updateValue);
            break;
        case event['requestContext']['http']['method'] === 'DELETE' && path === reservationPath:
            response = await deleteReservation(event.queryStringParameters.ReservationId );
            break;
        case event['requestContext']['http']['method'] === 'GET' && path === reservationsPath:
            response = await getReservations();
            break;
        default:
            response = buildResponse(404, '404 Not Found !!');
    }
    return response; 
};

async function getReservation(ReservationId){
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'ReservationId': Number(ReservationId)
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
        console.error('getReservation :',error);
    });
}

async function getReservations(){
    const params = {
        TableName: dynamodbTableName
    }
    const allReservations = await scanDynamoRecords(params, []);
    const body = {
        Operation: 'GET',
        Status: 'true',
        Message: 'Files fetched Successfully !!',
        Data: allReservations
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

async function saveReservation(requestBody){
    const params = {
        TableName: dynamodbTableName,
        Item: requestBody
    }
    return await dynamodb.put(params).promise().then((response) =>{
        const body = {
            Operation: 'SAVE',
            Status: 'true',
            Message: 'Reservation saved Successfully !!',
            Data: requestBody
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('saveReservation :',error);
    });
}

async function updateReservation(ReservationId, updateKey, updateValue){
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'ReservationId': Number(ReservationId)
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
            Message: 'Reservation updated Successfully !!',
            Data: response
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('updateReservation :',error);
    });
}

async function deleteReservation(ReservationId){
     console.log('deleteReservation :',ReservationId);
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'ReservationId': Number(ReservationId)
        },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) =>{
        const body = {
            Operation: 'DELETE',
            Status: 'true',
            Message: 'Reservation deleted Successfully !!',
            Data: response
        }
        return buildResponse(201, body);
    },(error) =>{
        console.error('deleteReservation :',error);
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