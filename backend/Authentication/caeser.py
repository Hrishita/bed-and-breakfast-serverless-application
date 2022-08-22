from flask import Response
from flask import jsonify

def hello_world(request):
    # For more information about CORS and CORS preflight requests, see
    # https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
    # for more information.

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        
    headers = { 'Access-Control-Allow-Origin': '*'}
        
    text = request.args.get('text')
        
    key = request.args.get('key')
        
    encrypted = ""
        
    text = text.upper()
        
    upperCharsList= ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        
    for char in text:
        ind = upperCharsList.index(char) + int(key)
        ind = ind % 26
        encrypted += upperCharsList[ind]
        
    return jsonify({ "output": encrypted})