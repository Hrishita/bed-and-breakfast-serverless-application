import boto3
import time
import json
import os
import logging
from boto3.dynamodb.conditions import Key

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def get_slots(intent_request):
    return intent_request['currentIntent']['slots']


def elicit_slot(session_attributes, intent_name, slots, slot_to_elicit, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ElicitSlot',
            'intentName': intent_name,
            'slots': slots,
            'slotToElicit': slot_to_elicit,
            'message': message
        }
    }


def close(session_attributes, fulfillment_state, message):
    response = {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': fulfillment_state,
            'message': message
        }
    }

    return response


def delegate(session_attributes, slots):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }
    }


def parse_int(n):
    try:
        return int(n)
    except ValueError:
        return float('nan')

def OrderId():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Breakfast')
    resp = table.scan()
    
    return max([i['orderId'] for i in resp['Items']])
    
def getFoodItem(dishes_type):
    
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('FoodItem')
    response=table.scan()
    for i in response['Items']:
        if i['ItemName'] ==str(dishes_type):
            return i
            
def order_food(intent_request):
    food_type = get_slots(intent_request)["dishesType"]
    food_number=get_slots(intent_request)["dishesNumber"]
    food_item=getFoodItem(food_type)
    source = intent_request['invocationSource']
    price=int(getFoodItem(food_type)['price']) *int(food_number)
    
    foodinvoice= {
        'orderId': int(OrderId())+1,
        'CustomerId':'erty1658599722714',
        'DishId': int(getFoodItem(food_type)['ItemId']),
        'Number_of_Dishes':food_number,
        'TotalAmt':price
    }
    client = boto3.resource('dynamodb')
    table = client.Table("Breakfast")
    table.put_item(Item=foodinvoice)
    
    if source == 'DialogCodeHook':
        output_session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
        if food_type is not None:
            output_session_attributes['Price'] = 1 

        return delegate(output_session_attributes, get_slots(intent_request))

    return close(intent_request['sessionAttributes'],
                 'Fulfilled',
                 {'contentType': 'PlainText',
                  'content': 'Thanks, your order for {} has been placed and will be ready in {}'.format(food_type,str(getFoodItem(food_type)['PrepTime']))})
                  
def dispatch(intent_request):
    logger.debug('dispatch userId={}, intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))
    intent_name = intent_request['currentIntent']['name']
    if intent_name == 'OrderFood':
        return order_food(intent_request)

    raise Exception('Intent with name ' + intent_name + ' not supported')

def lambda_handler(event, context):
    os.environ['TZ'] = 'America/New_York'
    time.tzset()
    logger.debug('=================>'.format(Key))
    logger.debug('event.bot.name={}'.format(event['bot']['name']))

    return dispatch(event)
