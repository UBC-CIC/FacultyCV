# Bulk Load CSV Guide

This document has information about the various CSV files used for bulk loading data into the application's database.

## Content

1. Data Section Loading (data_sections.csv)
2. Institution Data Loading (institution_data.csv)
3. Teaching Data Loading (teaching_data.csv)
4. University Information Loading (university_info.csv)

## Data Section Loading (data_sections.csv)

This CSV is to pre-load a few data sections for users. These can be generic sections like Post Secondary Education.

See ![CSV file](../docs/sample_data/data_sections.csv).

![This](../cdk/lambda/bulkDataSectionsUpload/lambda_function.py) lambda function processes the CSV file as soon as it is uploaded to the S3 bucket. 

Here are all the data sections (in order) in the above CSV files, as well as any comments about formatting if necessary:

* Title - (a string - like Continuing Education)
* Description - (a string)
* Data Type - (a string - this is an over-arching category that contains various sections, for e.g. Continuing Education might go under Education)
* Attributes - (JSON string - Since every section may have a different structure, the section attributes are stored as JSON where each value is initialized to an empty string. This is to tell the application what format to expect data in). For example:

```
{
  "First Name": "",
  "Last Name": "",
  "Age": ""
}
```

## Institution Data Loading (institution_data.csv)

This CSV is to load HR data for users. This is the Bulk User load feature. It creates users in the database. 

See ![CSV file](../docs/sample_data/institution_data.csv).

![This](../cdk/lambda/bulkUserUpload/lambda_function.py) lambda function processes the CSV file as soon as it is uploaded to the S3 bucket. 

Here are all the data sections (in order) in the above CSV files, as well as any comments about formatting if necessary:

* SNAPSHOT_DATE (e.g. 7/6/2024)
* PREFERRED_FIRST_NAME (a string, e.g. Amy)
* PREFERRED_LAST_NAME (a string, e.g. Burns)
* PREFERRED_FULL_NAME (a string, e.g. Amy Burns)
* INSTITUTION_USER_ID (a unique id identifying the user on an institution level)
* EMAIL_ADDRESS (a string)
* PRIMARY_DEPARTMENT_AFFILIATION_ID (a unique id)
* PRIMARY_DEPARTMENT_AFFILIATION (a string)
* SECONDARY_DEPARTMENT_AFFILIATION_ID (a unique id)
* SECONDARY_DEPARTMENT_AFFILIATION (a string)
* PRIMARY_FACULTY_AFFILIATION_ID (a unique id)
* PRIMARY_FACULTY_AFFILIATION (a string)
* SECONDARY_FACULTY_AFFILIATION_ID (a unique id)
* SECONDARY_FACULTY_AFFILIATION (a string)
* PRIMARY_CAMPUS_LOCATION_ID (a unique id)
* PRIMARY_CAMPUS_LOCATION (a string)
* SECONDARY_CAMPUS_LOCATION_ID (a unique id)
* SECONDARY_CAMPUS_LOCATION (a string)
* PRIMARY_ACADEMIC_RANK (should be one of the ranks listed in university_info.csv)
* PRIMARY_ACADEMIC_TRACK_TYPE (e.g. Term, Visiting)
* PRIMARY_JOB_PROFILE_CODE (a string)
* PRIMARY_JOB_PROFILE_NAME (a string)
* SECONDARY_ACADEMIC_RANK (should be one of the ranks listed in university_info.csv)
* SECONDARY_ACADEMIC_TRACK_TYPE (e.g. Term, Visiting)
* SECONDARY_JOB_PROFILE_CODE (a string)
* SECONDARY_JOB_PROFILE_NAME (a string)

## Teaching Data Loading (teaching_data.csv)

This CSV file is to load teaching data for the users in the database.

See ![CSV file](../docs/sample_data/teaching_data.csv).

![This](../cdk/lambda/bulkTeachingDataUpload/lambda_function.py) lambda function processes the CSV file as soon as it is uploaded to the S3 bucket.

Here are all the data sections (in order) in the above CSV files, as well as any comments about formatting if necessary:

* year (e.g. 2019)
* session (e.g. Winter, Summer, Fall, etc.)
* course (e.g. MATH 100)
* description (a string)
* scheduled_hours (a number)
* class_size (a number)
* lectures (a number)
* tutorials (a number)
* labs (a number)
* other (a number)
* institution_user_id (a unique id identifying the user on an institution level - this should be consistent with the INSTITUTION_USER_ID field in institution_data.csv)

## University Information Loading (university_info.csv)

This CSV file is to load information contained in certain dropdown menus (e.g. Faculty, Department, etc.).

See ![CSV file](../docs/sample_data/university_info.csv).

![This](../cdk/lambda/bulkUniversityInfoUpload/lambda_function.py) lambda function processes the CSV file as it is uploaded to the S3 bucket.

Here are all the data sections (in order) in the above CSV files, as well as any comments about formatting if necessary:

* Type (a string - the type of data, e.g. "Faculty". These can be many. E.g. There can be many entries with the Type "Faculty")
* Value (a string - e.g. Science)
