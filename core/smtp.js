import { SMTPServer } from 'smtp-server';
import { MailParser } from 'mailparser';
import gracefulShutdown from './gracefulShutdown';
import imageHandler from '../lib/ImageHandler';
import slack from '../lib/SlackHandler';
import co from 'co';
import moment from 'moment';

const port = process.env.PORT || 25;

const server = new SMTPServer({
	secure: false,
	authOptional: true,
	logger:true,
	allowInsecureAuth:true,
	banner: 'maptasking SMTP fake - locate what matters',
	onAuth(auth, session, callback){
		callback(null, {user: 123});
	},
	onData(stream, session, callback) {
		let mailparser = new MailParser();

		console.log(" 1) Llego un email");

		mailparser.on('end', (email) => {
			const receivedDate =  moment(email.receivedDate).format('DD/MM/YYYY hh:mm:ss');
			console.log(" 2) El asunto es : %s || Fecha de recepcion: %s", email.subject, receivedDate);

			email.attachments = (email.attachments || []).map(_processAttachments);

			if(email.attachments.length === 0) {
				console.log(" 3) No existe contenido adjunto dentro de este email");
				console.log(" *************************************************** ");
			}
		});
		stream.pipe(mailparser); // print message to console
		stream.on('end', callback);
	}
});

const _processAttachments = (attachment) => {
	attachment.content = attachment.content.toString('base64');

	console.log(" 3) Contenido adjunto : - %s -", attachment.fileName);

	co(function*() {

		const imageURL = yield imageHandler.saveImage(attachment);
		console.log(" 4) Imagen guardada");

		let response = yield slack.upload(attachment.fileName, null,imageURL);
		imageHandler.deleteImage(attachment.fileName);
		return true;

	}).then((value) => {
		console.log(" 5) Imagen subida a slack exitosamente");
		console.log(" \n *************************************************** \n");
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
