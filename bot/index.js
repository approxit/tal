const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.info(`Logged in as ${client.user.tag}!`);

    client.commands.forEach(command => {
        var applicationRoot = client.api.applications(client.user.id);

        if (process.env.DEBUG_GUILD_ID) {
            applicationRoot = applicationRoot.guilds(process.env.DEBUG_GUILD_ID);
            console.log(`Using guild "${process.env.DEBUG_GUILD_ID}" commands instead of global commands`)
        }

        applicationRoot.commands.post({
            data: {
                name: command.name,
                description: command.description,
                options: command.options || [],
            }
        }).then(() => {
            console.log(`Command "${command.name}" posted to Discord`)
        }).catch(console.error)
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
        console.error(err);
        return;
    }

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: response ? 3 : 5,
            data: response,
        }
    }).catch(console.error);
});

client.login(process.env.DISCORD_TOKEN);