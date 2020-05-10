const AWS = require('aws-sdk');
const fs = require('fs');
const parse = require('neat-csv');

/**
 * Finds the Location of the file referenced on the csv
 * @param {Object} object Object from csv file
 * @param {string} identifyingKey The hash key defined on DynamoDB. MUST BE THE SAME AS THE ONE USED TO UPLOAD TO S3
 * @param {Object[]} s3Objects Array of Key-Value pairs of the objects uploaded to the S3 bucket
 */
const findS3Key = (object, identifyingKey, s3Objects) => {
    const s3Object = s3Objects.find(
        candidate => candidate.file === object[identifyingKey]
    );

    if (!s3Object) {
        return '';
    }

    return s3Object.location;
};

/**
 * Upload the parsed csv to dynamoDB and ensures that all files have their corresponding s3Key
 * @param {Object[]} objects Parsed CSV objects
 * @param {Strin} identifyingKey The hash key defined on DynamoDB. MUST BE THE SAME AS THE ONE USED TO UPLOAD TO S3
 * @param {Object[]} s3Objects Array of Key-Value pairs of the objects uploaded to the S3 bucket
 */
const uploadParsedCsv = (objects, identifyingKey, s3Objects) => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    objects = objects.filter(object => object !== undefined);
    s3Objects = s3Objects.filter(object => object !== undefined);

    return objects.map(object => {
        const item = {};

        for (const [key, value] of Object.entries(object)) {
            item[key.replace(/ /g, '')] = value;
        }

        item.s3Key = findS3Key(item, identifyingKey, s3Objects);

        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: item
        };

        return docClient
            .put(params)
            .promise()
            .then(() => {
                console.log('Uploaded to DynamoDB', item[identifyingKey]);
            })
            .catch(err => {
                console.error(err);
            });
    });
};

/**
 * Parse the csv in the specified location, and upload to DynamoDB using an S3Key to reference the file in the corresponding S3 bucket
 * @param {string} fileLocation relative path to the csv file
 * @param {string} identifyingKey The hash key defined on DynamoDB. VALUE MUST BE THE SAME AS THE ONE USED TO UPLOAD TO S3
 * @param {Object[]} s3Objects Array of Key-Value pairs of the objects uploaded to the S3 bucket
 */
const uploadToDynamo = async (fileLocation, identifyingKey, s3Objects) => {
    const stream = fs.createReadStream(`${__dirname}${fileLocation}`);

    return parse(stream).then(objects =>
        uploadParsedCsv(objects, identifyingKey, s3Objects)
    );
};

module.exports = uploadToDynamo;
