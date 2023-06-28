const AWS = require('aws-sdk');
require("dotenv").config();
exports.uploadToS3 = (data, fileName) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_SECRET_KEY = process.env.IAM_SECRET_KEY;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_SECRET_KEY
    })

        let params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: data,
            ACL: 'public-read'
        }

        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, s3response) => {
                if(err){
                    console.log('something went wrong', err);
                    reject(err)
                }
                else{
                    console.log('success', s3response);
                    resolve (s3response.Location);
                }
            })
        })
        
}