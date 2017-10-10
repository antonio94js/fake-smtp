import request from 'request-promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import stream from 'stream';

dotenv.config();
const { SLACK_TOKEN } = process.env;

class SlackHandler {
    upload(filename, imageContent,imageURL){

        return request.post({
            url: 'https://slack.com/api/files.upload',
            formData: {
                token: SLACK_TOKEN,
                title: "Image",
                filename: filename,
                filetype: "auto",
                channels: 'surveillance',
                file: fs.createReadStream(path.join(__dirname, `../assets/${imageURL}`))
            },
        });
    }
}
const slack = new SlackHandler();

export default slack;
