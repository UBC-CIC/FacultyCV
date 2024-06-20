import sys
import json
import io
import pandas as pd
import numpy as np
import psycopg2
import psycopg2.extras as extras
import boto3
from datetime import datetime
from awsglue.utils import getResolvedOptions
from custom_utils.utils import fetchFromS3, putToS3

# get environment variable for this Glue job
args = getResolvedOptions(
    sys.argv, ["BUCKET_NAME", "FILENAME_ID", "SECRET_NAME"])
BUCKET_NAME = args["BUCKET_NAME"]
FILENAME_ID = args["FILENAME_ID"]
SECRET_NAME = args["SECRET_NAME"]

def storeData():

    global FILENAME_INSERT

    s3_client = boto3.resource('s3')
    response = s3_client.Object(BUCKET_NAME, FILENAME_ID).get()
    status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")
    
    data_types = {
        'Faculty Member ID': str,
        'Name': str, 
        'Department': str, 
        'Agency': str,
        'Grant Program': str, 
        'Amount': int, 
        'Project Title': str,
        'Keywords': str, 
        'Dates': str, 
    }
    
    df_id = pd.read_csv(io.StringIO(response["Body"].read().decode(
        "utf-8")), header=0, keep_default_na=False, dtype=data_types)

    df_id = df_id.drop_duplicates()

    # rearrange columns order
    columns_order = ['Faculty Member ID', 'Name', 'Department', 'Agency',
                     'Grant Program', 'Amount', 'Project Title',
                     'Keywords', 'Dates']
    df_id = df_id[columns_order]

    # convert the entire DataFrame into a list of tuples (rows)
    cleanData = list(df_id.itertuples(index=False, name=None))

    # secretsmanager client to get db credentials
    sm_client = boto3.client("secretsmanager")
    response = sm_client.get_secret_value(SecretId=SECRET_NAME)["SecretString"]
    secret = json.loads(response)

    connection = psycopg2.connect(
        user=secret["username"],
        password=secret["password"],
        host=secret["host"],
        dbname=secret["dbname"]
    )
    cursor = connection.cursor()
    print("Successfully connected to database")

    # check for duplicate insertion
    query = "SELECT faculty_member_id, name, department, agency, grant_program, amount, project_title, keywords, dates FROM public.grant_data"
    cursor.execute(query)
    tableData = list(map(lambda tup: tuple("" if x == None else x for x in tup), cursor.fetchall()))
    # the difference between the two sets is the data that are unique and can be inserted into the database
    listOfValuesToInsert = list(set(cleanData) - set(tableData))

    # inserting to db
    query = "INSERT INTO grant_data (faculty_member_id, name, department, agency, grant_program, amount, project_title, keywords, dates) VALUES %s"
    extras.execute_values(cursor, query, listOfValuesToInsert)

    connection.commit()
    print(f"inserted {len(listOfValuesToInsert)} more rows!")
    # log the rows that are inserted
    # datetime object containing current date and time
    now = datetime.now()
    print("now =", now)
    # dd/mm/YY H:M:S
    dt_string = now.strftime("%d-%m-%Y_%H-%M-%S")
    print("date and time =", str(dt_string))

    query = """INSERT INTO data_update_logs (table_name, last_updated)
               VALUES (%s, %s)
               ON CONFLICT (table_name)
               DO UPDATE SET last_updated = EXCLUDED.last_updated   
    """
    data = ("grant_data", dt_string)
    cursor.execute(query, data)
    connection.commit()

    # For testing purposes
    query = "SELECT * FROM public.grant_data LIMIT 1"
    cursor.execute(query)
    print(cursor.fetchall())
    query = "SELECT COUNT(*) FROM public.grant_data"
    cursor.execute(query)
    print("# of rows right now: " + str(cursor.fetchall()))

    cursor.close()
    connection.close()

    df_insert = pd.DataFrame(listOfValuesToInsert, columns=columns_order)
    split = FILENAME_ID.split(".csv", 1)
    FILENAME_INSERT = (split[0] + "-insert" + split[1] +
                       ".csv").replace("ids-assigned/", "insert/", 1)
    putToS3(df_insert, BUCKET_NAME, FILENAME_INSERT)

    print("Job done!")

def main(argv):

    storeData()

if __name__ == "__main__":
    main(sys.argv)
