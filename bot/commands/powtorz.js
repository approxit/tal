const Discord = require('discord.js');
const discord = require('../discord');
const database = require('../database').database;
const getMemberLastDiceOptionsKey = require('../database').getMemberLastDiceOptionsKey;

module.exports = {
    name: 'powtorz',
    description: 'Ponownie wykonuje Twój ostatni rzut.',
	options: [
        {
            type: 3,
            name: 'komentarz',
            description: 'Dodatkowy komentarz do rzutu, jeśli ma być inny niż z ostatniego rzutu.',
        }
    ],
    async execute(guildId, member, options) {
		const diceOptions = await database.get(getMemberLastDiceOptionsKey(guildId, member));

		if (diceOptions) {
			if (options['komentarz']) {
				diceOptions['komentarz'] = options['komentarz']
			}

			return await discord.commands.get('rzut').execute(guildId, member, diceOptions);
		}
		else {
			console.log(`No previous rolls from "${member.displayName}"!`);

			return {
				type: 4,
				data: {
					content: 'Nie masz jeszcze wykonanych rzutów, wykonaj jakiś!',
					flags: 64,
				},
			};
		}
    },
};