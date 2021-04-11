const Discord = require('discord.js');
const database = require('../database').database;
const getMemberNickKey = require('../database').getMemberNickKey;
const getMemberImageKey = require('../database').getMemberImageKey;

module.exports = {
    name: 'ustaw',
    description: 'Zmienia ustawienia Turlacza dla użytkownika. Użyj bez argumentów, by wyświetlić obecny stan.',
    options: [
		{
			type: 3,
			name: 'nick',
			description: 'Nick wyświetlany podczas rzutów. Podaj "-" aby usunąć.',
		},
		{
			type: 3,
			name: 'obrazek',
			description: 'Obrazek wyświetlany podczas rzutów. Podaj "-" aby usunąć.',
		}
    ],
    async execute(guildId, member, options) {
		var responses = [];

		if (typeof options['nick'] !== 'undefined') {
			if (options['nick'] != '-') {
				await database.set(getMemberNickKey(guildId, member), options['nick']);
				console.log(`${member.displayName} set nick to "${options['nick']}"`);

				responses.push(`Zaktualizowano nick na \`${options['nick']}\`.`)
			}
			else {
				await database.delete(getMemberNickKey(guildId, member));
				console.log(`${member.displayName} removed nick`);

				responses.push('Usunięto nick.')
			}
		}

		if (typeof options['obrazek'] !== 'undefined') {
			if (options['obrazek'] != '-') {
				await database.set(getMemberImageKey(guildId, member), options['obrazek']);
				console.log(`${member.displayName} set image to "${options['obrazek']}"`);

				responses.push(`Zaktualizowano obrazek na \`${options['obrazek']}\`.`)
			}
			else {
				await database.delete(getMemberImageKey(guildId, member));
				console.log(`${member.displayName} removed image`);

				responses.push('Usunięto obrazek.')
			}
		}

		if (responses.length) {
			return {
				type: 4,
				data: {
					content: responses.join('\n'),
					flags: 64,
				}
			};
		}
		else {
			const nick = await database.get(getMemberNickKey(guildId, member)) || '-';
			const image = await database.get(getMemberImageKey(guildId, member)) || '-';

			console.log(`${member.displayName} have nick="${nick}" image="${image}"`);

			return {
				type: 4,
				data: {
					content: `Nick: \`${nick}\`\nObrazek: \`${image}\``,
					flags: 64,
				}
			};
		}
    },
};