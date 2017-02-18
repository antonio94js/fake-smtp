import path from 'path';
import Promise from 'bluebird';
import aws from '../lib/AwsHandler';

const writeFile = Promise.promisify(require('fs').writeFile);

export class ImageHandler {

    saveImage(imageData) {
        // const userUploadedImagePath = `images/${imageData.fileName}`;
        // const finalImagePath = path.join(__dirname, `../assets/${userUploadedImagePath}`);
        // const imageBuffer = new Buffer(imageData.content, 'base64')
        // return writeFile(finalImagePath, imageBuffer)
        //     .then((value) =>  userUploadedImagePath)
        //     .catch((err) => {throw err})
        const imageBuffer = new Buffer(imageData.content, 'base64');

        return aws.saveImage(this.getFileExtension(imageData.fileName), imageBuffer, imageData.fileName)
            .then(value => aws.getSignedUrl(imageData.fileName))
            .then(response => response.SignedURL)
            .catch((err) => {
                throw err;
            })
    }

    deleteImage(fileName) {

        return aws.removeImage(fileName).catch((err) => {})
    }

    getFileExtension(fileName) {
        const regexAll = /[^\\]*\.(\w+)$/;
        var [filename, extension] = fileName.match(regexAll);
        return extension;
    }

}
const imageHandler = new ImageHandler();

export default imageHandler;
