require('dotenv').config();
const AWS = require('aws-sdk');

const uploadToS3 = require('./uploadToS3');
const uploadToDynamo = require('./uploadToDynamo');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

uploadToS3(
    ['/data/blessings', '/data/mantras', '/data/songs', '/data/meditations'],
    ['.mp3']
).then(uploads => {
    console.log('promise fulfilled');
    console.log(uploads);

    uploadToDynamo('/data/data.csv', 'audioFileId', uploads).then(
        console.log('uploaded csv to dynamo')
    );
});
