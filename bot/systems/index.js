const fs = require('fs');
const path = require('path');

module.exports = new Map(
	fs
	.readdirSync(__dirname)
	.filter(file => file.endsWith('.js') && (file != path.basename(__filename)))
	.map(file => {
		const command = require(`./${file}`);
		return [path.basename(file, '.js'), command];
	})
);