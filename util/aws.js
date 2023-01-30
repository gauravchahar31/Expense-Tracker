const aws = require('aws-sdk');

const s3Bucket = new aws.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET
})

module.exports = s3Bucket;
