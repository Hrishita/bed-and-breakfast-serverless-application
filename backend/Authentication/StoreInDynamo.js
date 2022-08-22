
    // TODO implement
    
    var AWS = require('aws-sdk');

    AWS.config.update({region: 'us-east-1'});
    
    var dynamodb = new AWS.DynamoDB();
    
    exports.handler = (event, context, callback) => {
        //console.log(event)
        const email = event.email;
        const firstName = event.firstName;
        const lastName = event.lastName;
        const phone = event.phone;
        const customerid = event.customerid;
        const params = {
    		TableName: "UserRegistration",
    		Item: {
    			'email': { "S": email },
    			'firstName': { "S": firstName},
    			'lastName': { "S": lastName },
    			'customerid': { "S": customerid },
    			'Phone' : {"S" : phone}
    		}
    	};
    	console.log(params)
    	dynamodb.putItem(params, function (err,data) {
    		if (err) {
    			console.error("unable to update ", err);
    			return false
    		} else {
    		    return "updated"	
    		}
        })
}
