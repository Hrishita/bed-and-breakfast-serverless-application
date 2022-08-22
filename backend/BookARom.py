import json
import datetime
import time
import os
import dateutil.parser
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

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


def confirm_intent(session_attributes, intent_name, slots, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ConfirmIntent',
            'intentName': intent_name,
            'slots': slots,
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

def ReservationId():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Reservation')
    resp = table.scan()
    
    return max([i['ReservationId'] for i in resp['Items']])
    


def safe_int(n):
    if n is not None:
        return int(n)
    return n


def try_ex(func):
    try:
        return func()
    except KeyError:
        return None


def generate_hotel_price( nights, room_type,room_size):
    room_types = ['single', 'double', 'family']
    room_sizes = ['basic', 'deluxe', 'economy','standard']
    return nights * (100  + (100 + room_types.index(room_type.lower())) + (100 + room_sizes.index(room_size.lower())))

def isvalid_room_type(room_type):
    room_types = ['single', 'double', 'family']
    return room_type.lower() in room_types

def isvalid_room_size(room_size):
    room_sizes = ['basic', 'deluxe', 'economy','standard']
    return room_size.lower() in room_sizes


def isvalid_date(date):
    try:
        dateutil.parser.parse(date)
        return True
    except ValueError:
        return False


def get_day_difference(later_date, earlier_date):
    later_datetime = dateutil.parser.parse(later_date).date()
    earlier_datetime = dateutil.parser.parse(earlier_date).date()
    return abs(later_datetime - earlier_datetime).days


def add_days(date, number_of_days):
    new_date = dateutil.parser.parse(date).date()
    new_date += datetime.timedelta(days=number_of_days)
    return new_date.strftime('%Y-%m-%d')


def build_validation_result(isvalid, violated_slot, message_content):
    return {
        'isValid': isvalid,
        'violatedSlot': violated_slot,
        'message': {'contentType': 'PlainText', 'content': message_content}
    }


def validate_hotel(slots):
    checkin_date = try_ex(lambda: slots['CheckInDate'])
    nights = safe_int(try_ex(lambda: slots['Nights']))
    room_type = try_ex(lambda: slots['RoomType'])
    room_size = try_ex(lambda: slots['RoomSize'])
    if checkin_date:
        if not isvalid_date(checkin_date):
            return build_validation_result(False, 'CheckInDate', 'I did not understand your check in date.  When would you like to check in?')
        if datetime.datetime.strptime(checkin_date, '%Y-%m-%d').date() <= datetime.date.today():
            return build_validation_result(False, 'CheckInDate', 'Reservations must be scheduled at least one day in advance.  Can you try a different date?')

    if nights is not None and (nights < 1 or nights > 30):
        return build_validation_result(
            False,
            'Nights',
            'You can make a reservations for from one to thirty nights.  How many nights would you like to stay for?'
        )

    if room_type and not isvalid_room_type(room_type):
        return build_validation_result(False, 'RoomType', 'I did not recognize that room type.  Would you like to stay in a single, double, or family?')

    if room_size and not isvalid_room_size(room_size):
        return build_validation_result(False, 'RoomSize', 'I did not recognize that room type.  Would you like to stay in a baisc, deluxe,economy or standard room?')

    return {'isValid': True}

def getroomCode(roomCode):
    roomsCode={'single economy':1,'single basic':2,'single standard':3,'single deluxe':4,'double economy':5,'double basic':6,'double standard':7,'double deluxe':8,'family economy':9,'family basic':10,'family standard':11,'family deluxe':12,'Presidential':13}
    for k,v in roomsCode.items():
        if k==roomCode:
            return v

def book_hotel(intent_request):

    checkin_date = try_ex(lambda: intent_request['currentIntent']['slots']['CheckInDate'])
    nights = safe_int(try_ex(lambda: intent_request['currentIntent']['slots']['Nights']))

    room_type = try_ex(lambda: intent_request['currentIntent']['slots']['RoomType'])
    room_size = try_ex(lambda: intent_request['currentIntent']['slots']['RoomSize'])
    session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
 
    if checkin_date and nights and room_type and room_size:
            price = generate_hotel_price( nights, room_type,room_size)
            session_attributes['currentReservationPrice'] = price
    else:
            try_ex(lambda: session_attributes.pop('currentReservationPrice'))
  
    reservation= json.dumps({
        'ReservationId': int(ReservationId())+1,
        'BookingDate': checkin_date,
        'CustomerId':'abc1658618603557',
        'EndDate': (datetime.datetime.strptime(checkin_date, '%Y-%m-%d') + datetime.timedelta(days=5)).strftime('%Y-%m-%d'),
        'ExtraFacilityId':[],
        'RoomId': getroomCode(room_type +' '+ room_size),
        'RStatus':'Booked',
        'StartDate':checkin_date,
        'TotalAmt':price
    })
    client = boto3.resource('dynamodb')
    table = client.Table("Reservation")
    table.put_item(Item=json.loads(reservation) )
    session_attributes['currentReservation'] = reservation
    if intent_request['invocationSource'] == 'DialogCodeHook':
        validation_result = validate_hotel(intent_request['currentIntent']['slots'])
        if not validation_result['isValid']:
            slots = intent_request['currentIntent']['slots']
            slots[validation_result['violatedSlot']] = None

            return elicit_slot(
                session_attributes,
                intent_request['currentIntent']['name'],
                slots,
                validation_result['violatedSlot'],
                validation_result['message']
            ) 
        session_attributes['currentReservation'] = reservation
        return delegate(session_attributes, intent_request['currentIntent']['slots'])

    # Booking the hotel.  In a real application, this would likely involve a call to a backend service.
    logger.debug('bookHotel under={}'.format(reservation))
    
    try_ex(lambda: session_attributes.pop('currentReservationPrice'))
    try_ex(lambda: session_attributes.pop('currentReservation'))
    session_attributes['lastConfirmedReservation'] = reservation

    return close(
        session_attributes,
        'Fulfilled',
        {
            'contentType': 'PlainText',
            'content': 'Thanks, I have placed your reservation.   Please let me know if you would like to order food '
        }
    )


def dispatch(intent_request):
  
    logger.debug('dispatch userId={}, intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))

    intent_name = intent_request['currentIntent']['name']
    if intent_name == 'BookHotel':
        return book_hotel(intent_request)

    raise Exception('Intent with name ' + intent_name + ' not supported')


def lambda_handler(event, context):
    os.environ['TZ'] = 'America/New_York'
    time.tzset()
    logger.debug('event.bot.name={}'.format(event['bot']['name']))

    return dispatch(event)
