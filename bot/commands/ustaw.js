const Discord = require('discord.js');
const database = require('../database').database;
const getMemberNickKey = require('../database').getMemberNickKey;
const getMemberImageKey = require('../database').getMemberImageKey;

module.exports = {
    name: 'ustaw',
    description: 'Zmienia ustawienia Turlacza dla użytkownika.',
    options: [
		{
			type: 3,
			name: 'nick',
			description: 'Nick wyświetlany podczas rzutów. Podaj pusty aby usunąć.',
		},
		{
			type: 3,
			name: 'obrazek',
			description: 'Obrazek wyświetlany podczas rzutów. Podaj pusty aby usunąć.',
		}
    ],
    async execute(member, options, discord) {
		if (typeof options['nick'] !== 'undefined') {
			if (options['nick']) {
				await database.set(getMemberNickKey(member), options['nick']);
				console.log(`${member.nick} set image to "${options['nick']}"`);
			}
			else {
				await database.delete(getMemberNickKey(member));
				console.log(`${member.nick} removed image`);
			}
		}

		if (typeof options['obrazek'] !== 'undefined') {
			if (options['obrazek']) {
				await database.set(getMemberImageKey(member), options['obrazek']);
				console.log(`${member.nick} set image to "${options['obrazek']}"`);
			}
			else {
				await database.delete(getMemberImageKey(member));
				console.log(`${member.nick} removed image`);
			}
		}

		if ((typeof options['nick'] === 'undefined') && (typeof options['obrazek'] === 'undefined')) {
			const nick = await database.get(getMemberNickKey(member)) || '*brak*';
			const image = await database.get(getMemberImageKey(member)) || '*brak*';
			console.log(`${member.nick} have nick="${nick}" image="${image}"`);

			return {
				type: 4,
				data: {
					content: `Nick: ${nick}\nObrazek: ${image}`,
				}
			};
		}
    },
};