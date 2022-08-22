import boto3
import csv
import pandas as pd
from google.cloud import storage

def hello_world(request):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket('viz-food-b00901658')

    session = boto3.Session(
            aws_access_key_id='AKIAY7R3LVD5GISYRFAL',
            aws_secret_access_key='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',
            region_name='us-east-1'
        )

    dynamodb = session.resource('dynamodb')


    # food Chart

    food_item_table= dynamodb.Table('FoodItem_23')
    food_response = food_item_table.scan()
    food_result = food_response['Items']
    data_frame_food = pd.DataFrame(food_result)
    food_file_name ='/tmp/food_items.csv'
    #food_file_name = open('food.csv', 'w')
    data_frame_food.to_csv(food_file_name, index=False)

    print(data_frame_food)

    food_blob = bucket.blob('food_items.csv')
    food_blob.upload_from_filename(food_file_name)

    food_output = []


    for food in range (len(data_frame_food)-1):
        data = {'item_name':data_frame_food['item_name'][food], 'total_quantity_ordered': data_frame_food['total_quantity_ordered'][food]}
        food_output.append(data)
    print(food_output)
    keys = food_output[0].keys()
    print(keys)

    with open('/tmp/food_stats.csv', 'w', newline='') as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(food_output)


    food_status_blob = bucket.blob('food_stats.csv')
    food_status_blob.upload_from_filename(food_file_name)
    return "Success"