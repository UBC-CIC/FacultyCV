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

def getArchivedUserCVData(arguments):
    credentials = getCredentials()
    connection = psycopg2.connect(user=credentials['username'], password=credentials['password'], host=credentials['host'], database=credentials['db'])
    print("Connected to Database")
    cursor = connection.cursor()
    cursor.execute('SELECT user_cv_data_id, user_id, data_section_id, data_details, archive, archive_timestamp FROM user_cv_data WHERE user_id = %s AND archive = true', (arguments['user_id'],))
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    archived_user_cv_data = []
    if len(results) == 0:
        return {}
    for result in results:
        archived_user_cv_data.append({
            'user_cv_data_id': result[0],
            'user_id': result[1],
            'data_section_id': result[2],
            'data_details': result[3],
            'archive': result[4],
            'archive_timestamp': result[5].isoformat() if result[5] else None
        })
    return archived_user_cv_data

def lambda_handler(event, context):
    return getArchivedUserCVData(event['arguments'])
