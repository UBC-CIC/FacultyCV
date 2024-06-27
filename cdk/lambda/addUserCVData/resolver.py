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

def addUserCVData(arguments):
    credentials = getCredentials()
    connection = psycopg2.connect(user=credentials['username'], password=credentials['password'], host=credentials['host'], database=credentials['db'])
    print("Connected to Database")
    # Use dataSectionId to get section name from data_sections table
    cursor = connection.cursor()
    cursor.execute("SELECT title from data_sections WHERE data_section_id = %s", (arguments['dataSectionId'],))
    results = cursor.fetchall()
    if len(results) == 0:
        cursor.close()
        connection.close()
        return "FAIL: Data section id does not exist"
    title = results[0][0]
    # Store data in the user_cv_data table
    cursor.execute("INSERT INTO user_cv_data (user_id, data_type, data_section_id, data_details) VALUES (%s, %s, %s, %s)", (arguments['userId'], title, arguments['dataSectionId'], arguments['dataDetails']))
    cursor.close()
    connection.commit()
    connection.close()
    return "SUCCESS"

def lambda_handler(event, context):
    arguments = event['arguments']
    return addUserCVData(arguments=arguments)