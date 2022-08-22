'''
This file consists of script which would be of type HTTP.
This script would be triggered when the user clicks place order button.
The script would also receive request payload from the user  it would consist of {'email': '', jwt_token': '', 'item_name': ''}
This script would publish the message to the topic.
The script would publish with atributes of {'email': '', 'jwt_token': '', 'item_name': ''}
https://us-central1-csci5410-group23.cloudfunctions.net/place_order_trigger
'''

from curses import is_term_resized
import os
from google.cloud import pubsub_v1

def place_order_publisher(request):
    publisher = pubsub_v1.PublisherClient()
    project_id = "csci5410-group23"
    topic = "order-topic"
    request_json = request.get_json()

    if request_json and 'email' in request_json and 'jwt_token' in request_json and 'item_name' in request_json and 'item_id' in request_json:

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
        # publishing the message to the topic
        topic_name = 'projects/{project_id}/topics/{topic}'.format(
            project_id= project_id,
            topic= topic, 
        )
        print("topic associated")
        future = publisher.publish(topic_name, data, email=email,jwt_token=jwt_token,item_name=item_name, item_id=item_id,item_count=item_count)
        future.result()
        print("published")
        return {
            'status': 'success',
            'message': data.decode(),
            'atttributes': {
                'email': email,
                'jwt_token': jwt_token,
                'item_name': item_name,
                'item_id': item_id,
                'item_count':item_count
            }
        }

    else:
        return f'Order Not Placed !'
                                            