const Database = require('@replit/database');

module.exports = {
	database: new Database(),
	getMemberImageKey(guildId, member) {
		return `${guildId}-${member.id}-image`;
	},
	getMemberNickKey(guildId, member) {
		return `${guildId}-${member.id}-nick`;
	},
	getMemberLastDiceOptionsKey(guildId, member) {
		return `${guildId}-${member.id}-last-dice-options`;
	},
	getGuildDiceExplosionKey(guildId) {
		return `${guildId}-dice-explosion`;
	},
	getGuildDiceExplosionDefault() {
		return true;
	}
}