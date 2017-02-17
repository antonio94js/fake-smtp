import path from 'path';
import Promise from 'bluebird';

const writeFile = Promise.promisify(require('fs').writeFile);

export class ImageHandler {

    saveImage(imageData) {
        const userUploadedImagePath = `images/${imageData.fileName}`;
        const finalImagePath = path.join(__dirname, `../assets/${userUploadedImagePath}`);
        const imageBuffer = new Buffer(imageData.content, 'base64')
        return writeFile(finalImagePath, imageBuffer)
            .then((value) =>  userUploadedImagePath)
            .catch((err) => {throw err})
    }

}
const imageHandler = new ImageHandler();

export default imageHandler;
