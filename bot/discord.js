const fs = require('fs');
const Discord = require('discord.js');

const discord = new Discord.Client();
discord.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    discord.commands.set(command.name, command);
}

module.exports = discord;