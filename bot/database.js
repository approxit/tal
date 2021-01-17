const Database = require('@replit/database');

module.exports = {
	database: new Database(),
	getMemberImageKey(member) {
		return `${member.user.id}-image`;
	},
	getMemberNickKey(member) {
		return `${member.user.id}-nick`;
	},
}