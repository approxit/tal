require('./polyfill');
require('./replit');
const discord = require('./discord');

discord.once('ready', async () => {
    console.info(`Logged in as ${discord.user.tag}!`);

    discord.commands.forEach(async command => {
		var applicationCommands = discord.api.applications(discord.user.id).commands;
		
		const commands = await applicationCommands.get();
		for (const command of commands) {
			try {
				await discord.api.applications(discord.user.id).commands(command.id).delete();
			}
			catch (err){
				console.error(err)
			}
			console.log(`Removed old "${command.name}" command`);
		}

        if (process.env.DISCORD_GUILD_ID) {
            applicationCommands = discord.api.applications(discord.user.id).guilds(process.env.DISCORD_GUILD_ID).commands;
            console.log(`Using guild "${process.env.DISCORD_GUILD_ID}" commands instead of global commands`)
        }

		try {
			await applicationCommands.post({
				data: {
					name: command.name,
					description: command.description,
					options: command.options || [],
				}
			})
			console.log(`Command "${command.name}" posted`)
		}
		catch (err) {
			console.error(`Error in posting "${command.name}" command!`, err);
		}
    });
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

    try {
        var response = await discord.commands.get(command).execute(interaction.member, options);
    }
    catch (err) {
        console.error('Error with executing command!', err);
        return;
    }

	try {
		await discord.api.interactions(interaction.id, interaction.token).callback.post({
			data: response || {
				type: 5,
			}
		})
	}
	catch (err) {
		console.error('Error with responding to command!', err);
		return;
	}
});

discord.login(process.env.DISCORD_TOKEN);