const database = require('../database').database;
const getChannelSystemKey = require('../database').getChannelSystemKey;
const systems = require('../systems');

module.exports = {
    description: 'Zmienia ustawienia Turlacza dla aktualnego kanału. Użyj bez argumentów, by wyświetlić obecny stan.',
    options: [
		{
			type: 3,
			name: 'system',
			choices: [
				...Array.from(systems, ([systemCode, system]) => ({
					name: system.name,
					value: systemCode,
				})),
				{
					name: '-',
					value: '-',
				}
			],
			description: 'System RPG, który będzie aktywny na kanale. Podaj "-" aby usunąć.',
		},
    ],
    async execute(guildId, channelId, member, options) {
		var responses = [];

		const system = options['system'];
		
		if (typeof system !== 'undefined') {
			const channelSystemKey = getChannelSystemKey(guildId, channelId);

			if (system != '-') {
				await database.set(channelSystemKey, system);
				
				const systemName = systems.get(system).name;
				console.log(`${member.displayName} set system to "${systemName}"`);

				responses.push(`Zaktualizowano system na \`${systemName}\`.`)
			}
			else {
				await database.delete(channelSystemKey);
				console.log(`${member.displayName} removed system`);

				responses.push('Usunięto system.')
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
			const savedSystem = await database.get(getChannelSystemKey(guildId, channelId));
			const systemName = savedSystem !== null ? systems.get(savedSystem).name : '-';
			console.log(`${channelId} have system="${systemName}"`);

			return {
				type: 4,
				data: {
					content: `System: \`${systemName}\``,
					flags: 64,
				}
			};
		}
    },
};