'''
This file consists of the script which would be of trigger type pub/sub.
This script would listen to the topic and would be triggered when the message is received.
This script would call another function which would be of type HTTP.
This script would send the email of user, jwt_token, item_name to the function which would be of type HTTP.
'''

import base64
import requests
import boto3
from boto3.dynamodb.conditions import Key



def hello_pubsub(event, context):
    """Triggered from a message on a Cloud Pub/Sub topic.
    Args:
         event (dict): Event payload.
         context (google.cloud.functions.Context): Metadata for the event.
    """
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


    session = boto3.Session(
        aws_access_key_id='AKIAY7R3LVD5GISYRFAL',
        aws_secret_access_key='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',
        region_name='us-east-1'
    )

    # fethhing data from order table that matches the order id 
    dynamodb = session.resource('dynamodb')
    order_table = dynamodb.Table('customer_orders')
    resp = order_table.query(
            KeyConditionExpression= Key('order_id').eq('o1')  )
    print(resp['Items'][0]['prep_time'])
    prep_time = resp['Items'][0]['prep_time']
    message = "Your order would be ready for pickup in "+prep_time+" minutes"
    print(message)
    


