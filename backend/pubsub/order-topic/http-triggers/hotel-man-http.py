import boto3
from boto3.dynamodb.conditions import Key

def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    print(request_json['email'])
    email = request_json['email']
    session = boto3.Session(
        aws_access_key_id='AKIAY7R3LVD5GISYRFAL',
        aws_secret_access_key='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',
        region_name='us-east-1'
    )

    # fethhing data from order table that matches the order id 
    
    dynamodb = session.resource('dynamodb')
    order_table = dynamodb.Table('Total_Invoice_23')
    
    resp = order_table.query(
            KeyConditionExpression= Key('email_id').eq(email)  )
    print(resp['Items'][0])
    return resp['Items']
