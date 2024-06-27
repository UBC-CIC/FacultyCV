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

def getAllSections(arguments):
    credentials = getCredentials()
    connection = psycopg2.connect(user=credentials['username'], password=credentials['password'], host=credentials['host'], database=credentials['db'])
    print("Connected to Database")
    cursor = connection.cursor()
    cursor.execute('SELECT data_section_id, title, description, attributes FROM data_sections')
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    data_sections = []
    for result in results:
        data_sections.append({
            'dataSectionId': result[0],
            'title': result[1],
            'description': result[2],
            'attributes': result[3]
        })
    return data_sections

def lambda_handler(event, context):
    return getAllSections(event['arguments'])