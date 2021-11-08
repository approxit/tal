const Discord = require('discord.js');
const database = require('../database').database;
const getMemberNickKey = require('../database').getMemberNickKey;
const getMemberImageKey = require('../database').getMemberImageKey;
const getGuildDiceExplosionKey = require('../database').getGuildDiceExplosionKey;
const getGuildDiceExplosionDefault = require('../database').getGuildDiceExplosionDefault;

const boolean_true_mark = ':white_check_mark:';
const boolean_false_mark = ':negative_squared_cross_mark:';

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
		},
		{
			type: 5,
			name: 'przerzuty-kosci',
			description: 'Czy przerzucać kości k20 przy wynikach 1 oraz 20? Domyślnie kości są przerzucane.',
		},
    ],
    async execute(guildId, member, options) {
		var responses = [];

		const nick = options['nick'];
		const image = options['obrazek'];
		const diceExplosion = options['przerzuty-kosci'];

		if (typeof nick !== 'undefined') {
			const memberNickKey = getMemberNickKey(guildId, member);

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
			const memberImageKey = getMemberImageKey(guildId, member);

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

		if (typeof diceExplosion !== 'undefined') {
			const diceExplosionKey = getGuildDiceExplosionKey(guildId);

			if (diceExplosion != getGuildDiceExplosionDefault()) {
				await database.set(diceExplosionKey, diceExplosion);
			}
			else {
				await database.delete(diceExplosionKey);
			}

			if (diceExplosion) {
				console.log(`${member.displayName} enabled dice explosion`);

				responses.push(`Kości k20 będą przerzucane.`)
			}
			else {
				console.log(`${member.displayName} disabled dice explosion`);

				responses.push('Kości k20 nie będą przerzucane.')
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
			const savedNick = await database.get(getMemberNickKey(guildId, member)) || '-';
			const savedImage = await database.get(getMemberImageKey(guildId, member)) || '-';
			var savedDiceExplosion = await database.get(getGuildDiceExplosionKey(guildId));
			savedDiceExplosion = (savedDiceExplosion !== null) ? savedDiceExplosion : getGuildDiceExplosionDefault();
			const diceExplosionText = savedDiceExplosion ? boolean_true_mark : boolean_false_mark;

			console.log(`${member.displayName} have nick="${savedNick}" image="${savedImage}" dice explosion="${savedDiceExplosion}"`);

			return {
				type: 4,
				data: {
					content: `Nick: \`${savedNick}\`\nObrazek: \`${savedImage}\`\nPrzerzuty kości k20: ${diceExplosionText}`,
					flags: 64,
				}
			};
		}
    },
};