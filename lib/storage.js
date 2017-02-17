import util from 'util';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, '../data.json');

class EmailStorage {
	constructor() {
		this.mails = [];
		try {
			this.mails = require(dataPath);
		} catch (e) {}
	}

	addEmail(mail) {
		this.mails.push(mail);

		const BUFFER_SIZE = 100;
		if (this.mails.length > BUFFER_SIZE) {
			this.mails = this.mails.slice(-1 * BUFFER_SIZE);
		}

		fs.writeFile(dataPath, JSON.stringify(this.mails, null, '\t'));

	}
}

const emailStorage = new EmailStorage();

export default emailStorage;
