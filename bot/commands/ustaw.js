const Discord = require('discord.js');
const database = require('../database').database;
const getMemberNickKey = require('../database').getMemberNickKey;
const getMemberImageKey = require('../database').getMemberImageKey;
const getGuildDiceExplosionKey = require('../database').getGuildDiceExplosionKey;
const getGuildDiceExplosionDefault = require('../database').getGuildDiceExplosionDefault;

const boolean_true_mark = ':white_check_mark:';
const boolean_false_mark = ':negative_squared_cross_mark:';

module.exports = {
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
		},
    ],
    async execute(guildId, channelId, member, options) {
		var responses = [];

		const nick = options['nick'];
		const image = options['obrazek'];
		const diceExplosion = options['przerzuty-kosci'];

		if (typeof nick !== 'undefined') {
			const memberNickKey = getMemberNickKey(guildId, channelId, member);

			if (nick != '-') {
				await database.set(memberNickKey, nick);
				console.log(`${member.displayName} set nick to "${nick}"`);

				responses.push(`Zaktualizowano nick na \`${nick}\`.`)
			}
			else {
				await database.delete(memberNickKey);
				console.log(`${member.displayName} removed nick`);

				responses.push('Usunięto nick.')
			}
		}

		if (typeof image !== 'undefined') {
			const memberImageKey = getMemberImageKey(guildId, channelId, member);

			if (image != '-') {
				await database.set(memberImageKey, image);
				console.log(`${member.displayName} set image to "${image}"`);

				responses.push(`Zaktualizowano obrazek na \`${image}\`.`)
			}
			else {
				await database.delete(memberImageKey);
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
			const savedNick = await database.get(getMemberNickKey(guildId, channelId, member)) || '-';
			const savedImage = await database.get(getMemberImageKey(guildId, channelId, member)) || '-';

			console.log(`${member.displayName} have nick="${savedNick}" image="${savedImage}"`);

			return {
				type: 4,
				data: {
					content: `Nick: \`${savedNick}\`\nObrazek: \`${savedImage}\``,
					flags: 64,
				}
			};
		}
    },
};