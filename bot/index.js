require('./polyfill');
require('./replit');
const Discord = require('discord.js');
const discord = require('./discord');
const CommandError = require('./common').CommandError;

discord.commands = require('./commands');

discord.once('ready', async () => {
    console.info(`Logged in as ${discord.user.tag}`);

	var applicationCommands;
	if (process.env.DISCORD_GUILD_ID) {
		applicationCommands = discord.api.applications(discord.user.id).guilds(process.env.DISCORD_GUILD_ID).commands;
		console.log(`Using guild "${process.env.DISCORD_GUILD_ID}" commands`);
	}
	else {
		applicationCommands = discord.api.applications(discord.user.id).commands;
		console.log(`Using global commands`);
	}

	try {
		await applicationCommands.put({
			data: Array.from(discord.commands, ([commandCode, command]) => ({
				name: commandCode,
				description: command.description,
				options: command.options || [],
			})),
		});

		console.log(`Commands updated`)
	}
	catch (err) {
		console.error(`Error in updating commands!`, err);
	}
});

discord.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase();
    const options = (interaction.data.options || []).reduce((r, o) => {
        r[o.name] = o.value;
        return r;
    }, {});

    if (!discord.commands.has(command)) {
        console.error(`Received unknown command "${command}"!`);
        return;
    }

	const guildId = interaction.guild_id;
	const channelId = interaction.channel_id;
	const member = new Discord.GuildMember(discord, interaction.member, guildId);

    try {
        var response = await discord.commands.get(command).execute(guildId, channelId, member, options);
    }
    catch (err) {
		if (err instanceof CommandError) {
			var response = {
				type: 4,
				data: {
					content: err.message,
					flags: 64,
				},
			};
		}
		else {
        	console.error('Unhandled error while executing command!', err);
		}
    }

	try {
		await discord.api.interactions(interaction.id, interaction.token).callback.post({
			data: response,
		})
	}
	catch (err) {
		console.error('Error with responding to command!', err);
		return;
	}
});

discord.login(process.env.DISCORD_TOKEN);