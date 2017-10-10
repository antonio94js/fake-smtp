import path from 'path';
import Promise from 'bluebird';
import aws from '../lib/AwsHandler';
import fs from 'fs';

const writeFile = Promise.promisify(fs.writeFile);
const deleteFile = Promise.promisify(fs.unlink);

export class ImageHandler {

    saveImage(imageData) {
        const userUploadedImagePath = `images/${imageData.fileName}`;
        const finalImagePath = path.join(__dirname, `../assets/${userUploadedImagePath}`);
        const imageBuffer = new Buffer(imageData.content, 'base64')
        return writeFile(finalImagePath, imageBuffer)
            .then((value) => userUploadedImagePath)
            .catch((err) => {
                throw err
            })
    }

    deleteImage(fileName) {
        return deleteFile(path.join(__dirname, `../assets/images/${fileName}`)).catch((err) => {})
    }

    getFileExtension(fileName) {
        const regexAll = /[^\\]*\.(\w+)$/;
        var [filename, extension] = fileName.match(regexAll);
        return extension;
    }

}
const imageHandler = new ImageHandler();

export default imageHandler;
