import {
	SMTPServer
}
from 'smtp-server';
import {
	MailParser
}
from 'mailparser';
import publicIp from 'public-ip';
import emailStorage from '../lib/storage';
import gracefulShutdown from './gracefulShutdown';
import imageHandler from '../lib/ImageHandler';
import slack from '../lib/SlackHandler';
import co from 'co';
import request from 'request';

const port = process.env.PORT || 80;

let server = new SMTPServer({
	secure: false,
	authOptional: true,
	banner: 'maptasking SMTP fake - locate what matters',
	onData(stream, session, callback) {
		let mailparser = new MailParser();
		console.log("Llego un email")
		mailparser.on('end', (email) => {
			email.attachments = (email.attachments || []).map(_processAttachments);
			// emailStorage.addEmail(email);
		});
		stream.pipe(mailparser); // print message to console
		stream.on('end', callback);
	}
});

const _processAttachments = (attachment) => {
	attachment.content = attachment.content.toString('base64');
	co(function*() {

		const imageURL = yield imageHandler.saveImage(attachment);

		const imageData = request.get({uri:imageURL});

		let response = yield slack.upload(attachment.fileName, imageData);

		imageHandler.deleteImage(attachment.fileName);
		// console.log(response);

		// slack.upload(attachment.fileName, attachment.content).then((value) => {
		// 	console.log(value);
		// })

		// var base64 = require('base64-stream');
		// var stream = require('stream');
		//
		// var decoder = base64.decode();
		// var input = new stream.PassThrough();
		// var output = new stream.PassThrough();
		//
		// input.pipe(decoder).pipe(output);
		//
		// output.on('data', function(data) {
		// 	slack.upload(attachment.fileName, attachment.content)
		// });
		//
		// input.write(attachment.content);
		// input.write('ID');
		// console.log(JSON.parse(response.body));

		return true;
	}).then((value) => {
		console.log("Imagen subida a slack exitosamente");
	}).catch((err) => {
		console.error(err);
	})

	return attachment;
};

server.listen(port);

server.on('error', err => {
	console.error('Error %s', err.message);
});

process
	.on('SIGINT', gracefulShutdown.bind(null, server))
	.on('SIGTERM', gracefulShutdown.bind(null, server));

console.log('SMTP server listening on port ' + port);
