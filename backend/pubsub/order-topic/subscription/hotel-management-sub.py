import base64
import boto3
import requests
from boto3.dynamodb.conditions import Key

def hello_pubsub(event, context):
    
    pubsub_message = base64.b64decode(event['data']).decode('utf-8')
    print(pubsub_message)
    
    pubsub_item = event['attributes']['item_name']
    print(pubsub_item)

    pubsub_email = event['attributes']['email']
    print(pubsub_email)

    pubsub_jwt_token = event['attributes']['jwt_token']
    print(pubsub_jwt_token)

    pubsub_item_id =event['attributes']['item_id']
    print(pubsub_item_id)

    pubsub_item_count =event['attributes']['item_count']
    print(pubsub_item_count)

    pubsub_order_id = event['attributes']['order_id']
    print(pubsub_order_id)

    session = boto3.Session(
        aws_access_key_id='AKIAY7R3LVD5GISYRFAL',
        aws_secret_access_key='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',
        region_name='us-east-1'
    )

    # fethhing data from order table that matches the order id 
    
    dynamodb = session.resource('dynamodb')
    dynamodb_client = boto3.client('dynamodb')
    order_table = dynamodb.Table('Invoice_23')
    resp = order_table.scan()
    invoice = []
    for item in range(len(resp['Items'])):
        if pubsub_email in resp['Items'][item]['email']:
            
            invoice.append(resp['Items'][item])
    
    total = 0

    for item in range(len(invoice)):
        total = total + int(invoice[item]['Price'])

    dynamodb_client.put_item(TableName='Total_Invoice_23', 
    Item={
        'email': {'S': pubsub_email},
        'total_amount': {'S': str(total)},
        })
    return invoice

    