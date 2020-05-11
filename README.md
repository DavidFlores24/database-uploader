# database-uploader

A simple way of uploading a csv that references large files into a DynamoDB Table.
The uploader will store the files on an S3 bucket and reference the URL on the DynamoDB Table.

# Features
- CSV parser
- Promisified
- Mappings to Dynamo

# Installation
```
yarn add database-uploader
```
# Requirements
- A DynamodB Table
- An AWS S3 Bucket
- An IAM user with read/write roles for both of the above

# Usage
```javascript
const uploader = require("database-uploader");
```

## Setup Config
The first thing that you need to do is to setup the `AWS.config()` by running the following
```javascript
uploader.setConfig({
  accesKeyId: YOUR_ACCESS_KEY_ID,
  secretAccessKey: YOUR_SECRET_ACCESS_KEY,
  region: REGION_WHERE_BOTH_INSTANCES_ARE_RUNNING
});
```

## Upload files to S3
```javascript
const directories = [
  `${__dirname}/data/folder1`,
  `${__dirname}/data/folder2`,
  `${__dirname}/data/folder3`,
  `${__dirname}/data/folder4`
];

uploader.uploadToS3(directories, [".extension1", ".extension2", ".extension3"])
```

## Upload csv to DynamoDB
```javascript
uploader.uploadToDynamo(
      `${__dirname}/data/data.csv`,
      "table1",
      "fileId",
      s3Uploads
    )
```
