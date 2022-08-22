from flask import jsonify
import json
from typing import Dict
from google.cloud import aiplatform
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value
from flask import redirect
def hello_world(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    json_request = request.get_json(silent=True)
    print(json_request)
    project="746504383038"
    location="us-central1"
    endpoint_name= "7941033615612182528"
    instances=[
      {"booking_id": json_request['booking_id'],
      "age": json_request['age'],
      "number": json_request['number']} 
    ]
    aiplatform.init(project=project, location=location)
    endpoint = aiplatform.Endpoint(endpoint_name)
    response = endpoint.predict(instances=instances)
    for i in response.predictions:
        print(int(i["value"]))
        tour_package=int(i["value"]) 
    data = {
        'tour': tour_package
    }

    response = jsonify({
        'data': data
    })

    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
