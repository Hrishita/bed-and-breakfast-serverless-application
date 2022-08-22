'''
This script is used to receive the message send by he pub/sub triggered function.
It will receive the email as body paramerter, which will be used to authenticate user and send the notifiation.
'''

import boto3

def customer_sub(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()

    session = boto3.Session(
        aws_access_key_id='AKIAY7R3LVD5GISYRFAL',
        aws_secret_access_key='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',
        region_name='us-east-1'
    )


    # fethhing data from order table that matches the order id 
    dynamodb = session.resource('dynamodb')
    order_table = dynamodb.Table('customer-orders')
    order_response = order_table.get_item(
    Key={
        'order_id': request_json['item_id']
    }
)
    order_result = order_response['Item']
    print(order_result)



    print(request_json['email'])
    if request_json and 'email' in request_json and 'data' in request_json:
        print("inside")
        email = request_json["email"]
        message = request_json["data"]
        print(email)
        return email +" "+message
    else:
        return f'Hello World!'