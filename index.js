require('dotenv').config();

const fs = require('fs');
const csv = require('csv-parser');
const AWS = require('aws-sdk');
const path = require('path');

const uploadToS3 = require('./uploadToS3');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

uploadToS3(['/data/blessings', '/data/mantras', '/data/songs'], ['.mp3']).then(
    uploads => {
        console.log('promise fulfilled');
        console.log(uploads);
    }
);
