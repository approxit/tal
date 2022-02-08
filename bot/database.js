const Database = require('@replit/database');

module.exports = {
	database: new Database(),
	getChannelSystemKey(guildId, channelId) {
		return `${guildId}-${channelId}-system`;
	},
	getMemberImageKey(guildId, channelId, member) {
		return `${guildId}-${channelId}-${member.id}-image`;
	},
	getMemberNickKey(guildId, channelId, member) {
		return `${guildId}-${channelId}-${member.id}-nick`;
	},
	getMemberLastDiceOptionsKey(guildId, channelId, member) {
		return `${guildId}-${channelId}-${member.id}-last-dice-options`;
	},
}