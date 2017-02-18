import aws from 'aws-sdk';
import Promise from 'bluebird';
import path from 'path';

aws.config.loadFromPath(path.join(__dirname,'..','/aws.json'));

const BUCKET_NAME = 'servicecommerce';

const s3 = new aws.S3({
    params: {
        Bucket: BUCKET_NAME
    }
});

const saveImage = (mimeType, fileBuffer, ImageData) => {

    let data = {
        ACL: 'public-read',
        Bucket: BUCKET_NAME,
        Key: `surveillance/${ImageData}`,
        Body: fileBuffer,
        ContentEncoding: 'base64',
        ContentType: mimeType
    }

    return new Promise(function(resolve, reject) {
        s3.putObject(data, function(err, response) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });


};

const getSignedUrl = (fileName) => {

    let urlParams = {
        Bucket: BUCKET_NAME,
        Key: `surveillance/${fileName}`
    };

    return new Promise((resolve, reject) => {

        s3.headObject(urlParams, function(err, data) {
            if (err && err.code === 'NotFound') {
                resolve({message:'The image does not exist'})
            }
            else {
                urlParams.Expires = 43200; //Expires in 12 hours
                s3.getSignedUrl('getObject', urlParams, function(err, url) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({'SignedURL':url})
                    }
                })
            }
        });

    });
}

const removeImage = (fileName) => {

    let params = {
        Bucket: BUCKET_NAME,
        Delete: {
            Objects: [{
                Key: `surveillance/fileName`
            }]
        }
    };
    return new Promise((resolve, reject) => {
        s3.deleteObjects(params, function(err, data) {
            if (err) reject(err);
            else resolve({message:'Image deleted successfully'});
        });
    });

}



export default {
    saveImage, getSignedUrl, removeImage
}
