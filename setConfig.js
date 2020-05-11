const AWS = require("aws-sdk");

/**
 * Update the AWS config. Run this before any other process.
 * @param {Object} config AWS config object
 * @param {string} config.accessKeyId Access Key ID for the user with permissions to read/write S3 & DynamoDB
 * @param {string} config.secretAccessKey  Access Key for the user with permissions to read/write S3 & DynamoDB
 * @param {string} config.region AWS region where the S3 & DynamoDB instances are hosted
 */
const updateConfig = config => {
  const { accessKeyId, secretAccessKey, region } = config;

  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region
  });
};

module.exports = updateConfig;
