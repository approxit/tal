const discord = require('../discord');
const database = require('../database').database;
const CommandError = require('../common').CommandError;
const getChannelSystemOrThrow = require('../common').getChannelSystemOrThrow;
const getChannelSystemKey = require('../database').getChannelSystemKey;
const getMemberLastDiceOptionsKey = require('../database').getMemberLastDiceOptionsKey;

module.exports = {
    description: 'Ponownie wykonuje Twój ostatni rzut.',
	options: [
        {
            type: 3,
            name: 'komentarz',
            description: 'Dodatkowy komentarz do rzutu, jeśli ma być inny niż z ostatniego rzutu.',
        }
    ],
    async execute(guildId, channelId, member, options) {
		await getChannelSystemOrThrow(guildId, channelId);
		
		const diceOptions = await database.get(getMemberLastDiceOptionsKey(guildId, channelId, member));

		if (diceOptions === null) {
			console.log(`No previous rolls from "${member.displayName}"!`);

			throw new CommandError('Nie masz jeszcze wykonanych rzutów, wykonaj jakiś!');
		}	

		if (options['komentarz']) {
			diceOptions['komentarz'] = options['komentarz']
		}

		return await discord.commands.get('rzut').execute(guildId, channelId, member, diceOptions);
    },
};