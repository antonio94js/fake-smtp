import request from 'request-promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import stream from 'stream';

dotenv.config();
const {SLACK_TOKEN} = process.env;
// var bufferStream = new stream.PassThrough();

class SlackHandler {
    upload(filename, imageContent){
        // console.log(imageContent);
        // bufferStream.end(imageContent);
        // console.log(bufferStream);
        return request.post({
            url: 'https://slack.com/api/files.upload',
            formData: {
                token: SLACK_TOKEN,
                title: "Image",
                filename: filename,
                filetype: "auto",
                channels: 'random',
                // file: fs.createReadStream(path.join(__dirname, `../assets/${imageURL}`))
                file: imageContent
            },
        });
    }
}
const slack = new SlackHandler();

export default slack;
