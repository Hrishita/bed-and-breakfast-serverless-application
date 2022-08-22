'''
This script is of trigger type pub/sub.
This script would listen to the topic and would be triggered when the message is received.
This script would call another function which would be of type HTTP.
'''


import base64
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

    pubsub_item_count =event['attributes']['item_count']
    print(pubsub_item_count)

    session = boto3.Session(
        aws_access_key_id='AKIAY7R3LVD5GISYRFAL',
        aws_secret_access_key='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',
        region_name='us-east-1'
    )

    # fethhing data from order table that matches the order id 
    dynamodb = session.resource('dynamodb')
    order_table = dynamodb.Table('customer_orders')
    response = order_table.query(
            KeyConditionExpression= Key('order_id').eq(pubsub_item_id)  )
    print(response['Items'][0]['order_count'])
    order_count = response['Items'][0]['order_count']
    new_order_count = int(order_count) + int(pubsub_item_count)
    
    response = order_table.update_item(
    Key={
        'order_id': pubsub_item_id
    },
    UpdateExpression="set order_count = :r",
    ExpressionAttributeValues={
        ':r': str(new_order_count),
    },
    ReturnValues="UPDATED_NEW"
)

