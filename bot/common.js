const database = require('./database').database;
const getChannelSystemKey = require('./database').getChannelSystemKey;

class CommandError extends Error {

};

module.exports = {
	CommandError,
	async getChannelSystemOrThrow(guildId, channelId) {
		const system = await database.get(getChannelSystemKey(guildId, channelId));

		if (system !== null) {
			return system;
		}

		console.log(`No session prepared for channel ${channelId}!`);

		throw new CommandError(`Aby użyć tej komendy musisz przygotować ten kanał za pomocą komendy \`/sesja\`!`);
	},
}