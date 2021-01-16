const Database = require('@replit/database');

module.exports = {
	database: new Database(),
	getMemberImageKey(member) {
		return `${member.id}-image`;
	},
	getMemberNickKey(member) {
		return `${member.id}-nick`;
	},
}