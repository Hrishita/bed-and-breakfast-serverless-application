import boto3
import csv
import pandas as pd
from google.cloud import storage

storage_client = storage.Client()
bucket = storage_client.get_bucket('visualization-bucket-b00871849')

session = boto3.Session(
        aws_access_key_id='AKIAY7R3LVD5GISYRFAL',
        aws_secret_access_key='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',
        region_name='us-east-1'
    )

dynamodb = session.resource('dynamodb')


# Feedback Chart

feedback_table= dynamodb.Table('Feedback_23')
feedback_response = feedback_table.scan()
feedback_result = feedback_response['Items']
data_frame_feedback = pd.DataFrame(feedback_result)
feedback_file_name ='/tmp/feedback.csv'
#feedback_file_name = open('feedback.csv', 'w')
data_frame_feedback.to_csv(feedback_file_name, index=False)

feedback_blob = bucket.blob('feedback.csv')
feedback_blob.upload_from_filename(feedback_file_name)

feedback_output = []
feedback_count_data_frame = data_frame_feedback['polarity'].value_counts()

for feedback in range (len(data_frame_feedback)-1):
    data = {'polarity':feedback_count_data_frame.index[feedback],'count': feedback_count_data_frame.values[feedback]}
    feedback_output.append(data)

print(feedback_output)


keys = feedback_output[0].keys()

print(keys)

with open('/tmp/feedback_stats.csv', 'w', newline='') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(feedback_output)

feedback_status_blob = bucket.blob('feedback_stats.csv')
feedback_status_blob.upload_from_filename(feedback_file_name)
