import boto3
from boto3.dynamodb.conditions import Key

def hello_world(request):

    request_json = request.get_json()
    print(request_json)
    headers = {
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    if request_json and 'email' in request_json and 'jwt_token' in request_json and 'item_name' in request_json and 'item_id' in request_json and 'order_id' in request_json:

        print("inside")
       
        # fetching the email, jwt_token and item_name from the request payload
        email = request_json["email"]
        print(email)
        jwt_token = request_json["jwt_token"]
        print(jwt_token)
        item_name = request_json["item_name"]
        print(item_name)
        item_id = request_json["item_id"]
        print(item_id)
        data = b'Order has been placed'
        print(data.decode())
        item_count = request_json["item_count"]
        print(item_count)
        price = request_json["price"]
        print(price)
        order_id = request_json["order_id"]
        print(order_id)
    # fethhing data from order table that matches the order id

        dynamodb_client = boto3.client('dynamodb', aws_access_key_id='AKIAY7R3LVD5GISYRFAL',
                                   aws_secret_access_key='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',
                                   region_name='us-east-1')
  
        dynamodb_client.put_item(TableName='Invoice_23', 
        Item={
        'email': {'S': email},
        'order_id': {'S': str(order_id)},
        'item_name': {'S': str(item_name)},
        'item_id': {'S': str(item_id)},
        'quantity_ordered': {'S': str(item_count)},
        'Price':    {'S': str(price)},
        })
        return "Success"
