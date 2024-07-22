import boto3
import json
import psycopg2

sm_client = boto3.client('secretsmanager')

def getCredentials():
    credentials = {}

    response = sm_client.get_secret_value(SecretId='facultyCV/credentials/dbCredentials')
    secrets = json.loads(response['SecretString'])
    credentials['username'] = secrets['username']
    credentials['password'] = secrets['password']
    credentials['host'] = secrets['host']
    credentials['db'] = secrets['dbname']
    return credentials

def updateUserCVData(arguments):
    credentials = getCredentials()
    connection = psycopg2.connect(user=credentials['username'], password=credentials['password'], host=credentials['host'], database=credentials['db'])
    print("Connected to Database")
    cursor = connection.cursor()
    user_connection_json = json.dumps(arguments['user_connection'])  # Convert user_connection dictionary to JSON string
    cursor.execute("UPDATE user_connections SET user_connection = %s WHERE user_connection_id = %s", (user_connection_json, arguments['user_connection_id']))
    cursor.close()
    connection.commit()
    connection.close()
    return "SUCCESS"

def lambda_handler(event, context):
    arguments = event['arguments']
    return updateUserCVData(arguments=arguments)