const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * get all the files from the specified directory
 * @param {string} directory relative path to the directory
 * @param {string[]} acceptedExtensions file extensions to be uploaded
 * @returns {Promise.<string[]>} full path to all files
 */
const getFilesFromDir = async (directory, acceptedExtensions) => {
    const dirPath = `${__dirname}${directory}`;
    const readdir = util.promisify(fs.readdir);

    let files = await readdir(dirPath);
    files = files.map(file => {
        if (acceptedExtensions.includes(path.extname(file))) {
            return `${dirPath}/${file}`;
        }
    });

    return files;
};

/**
 * get the path to all the files in the specified directories
 * @param {string[]} directories relative path to directories where the files are found
 * @param {string[]} acceptedExtensions file extensions to be uploaded
 * @returns {Promise.<string[]>} full path to all files
 */
const getAllFiles = async (directories, acceptedExtensions) => {
    const promises = directories.map(directory =>
        getFilesFromDir(directory, acceptedExtensions)
    );

    const files = await Promise.all(promises);
    return files.flat();
};

const mapFileObjects = async files => {
    const s3 = new AWS.S3();
    const promises = files.map(async file => {
        if (file !== undefined) {
            const stream = fs.createReadStream(file);
            stream.on('error', err => console.error(err));

            const fileName = path.basename(file);
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Body: stream,
                Key: fileName
            };

            const upload = await s3.upload(uploadParams).promise();
            console.log('Upload Success', upload.Location);

            return {
                file: fileName,
                location: upload.Location
            };
        }
    });

    return Promise.all(promises);
};

/**
 * Upload all the files in the specified directories to the S3 bucket defined on the .env file
 * @param {string[]} directories relative path to directories where the files are found
 * @param {string[]} acceptedExtensions file extensions to be uploaded
 * @returns {Promise.<uploadedFiles>} object with fileNames and their location on S3
 */
const uploadToS3 = async (directories, acceptedExtensions) => {
    console.log('uploading to S3');

    return getAllFiles(directories, acceptedExtensions).then(files =>
        mapFileObjects(files)
    );
};

module.exports = uploadToS3;
