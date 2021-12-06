// https://discordjs.guide/creating-your-bot/creating-commands.html#command-deployment-script

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const {
  DISCORD_BOT_ID = '',
  DISCORD_GUILD_ID = '',
  DISCORD_BOT_TOKEN = ''
} = process.env;

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('rankings').setDescription('Show rankings'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(DISCORD_BOT_ID, DISCORD_GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
