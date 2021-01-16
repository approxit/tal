require('./polyfill');

// Repl.it keep alive endpoint
if (process.env.KEEP_REPL_ALIVE) {
	const http = require('http');

	const server = http.createServer((req, res) => {
	res.writeHead(200);
	res.end(`Bot is responding! (${new Date().getTime()})`);
	});

	server.on('error', (err) => {
		console.error(err);
		process.exit(1);
	})

	server.listen(3000);
}

// Discord bot
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.info(`Logged in as ${client.user.tag}!`);

    client.commands.forEach(async command => {
		var applicationCommands = client.api.applications(client.user.id).commands;
		
		const commands = await applicationCommands.get();
		for (const command of commands) {
			try {
				await client.api.applications(client.user.id).commands(command.id).delete();
			}
			catch (err){
				console.error(err)
			}
			console.log(`Removed old "${command.name}" command`);
		}

        if (process.env.DISCORD_GUILD_ID) {
            applicationCommands = client.api.applications(client.user.id).guilds(process.env.DISCORD_GUILD_ID).commands;
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

client.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase();
    const options = interaction.data.options.reduce((r, o) => {
        r[o.name] = o.value;
        return r;
    }, {
        '_client': client,
    });

    if (!client.commands.has(command)) {
        console.error(`Received unknown command "${command}"!`);
        return;
    }

    try {
        var response = client.commands.get(command).execute(interaction.member, options);
    }
    catch (err) {
        console.error('Error with executing command!', err);
        return;
    }

	try {
		await client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: response ? 3 : 5,
				data: response,
			}
		})
	}
	catch (err) {
		console.error('Error with responding to command!', err);
		return;
	}
});

client.login(process.env.DISCORD_TOKEN);