import path from 'path';
import { Client, Intents, MessageEmbed } from 'discord.js';

import logger from './logger';

import fs from 'fs';

const {
  RANKING_FILE = '',
} = process.env;

const filename = path.basename(__filename);

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client
  .on('ready', () => {
    logger.info(`logged in as ${client.user?.tag}`);
  })
  .on('debug', (info) => {
    logger.silly(`${filename} | debug: ${info}`);
  })
  // https://discordjs.guide/creating-your-bot/creating-commands.html#replying-to-commands
  .on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
      await interaction.reply('pong');
    } else if (commandName === 'rankings') {

      // get json
      let memberEntries;
      try {
        const result = fs.readFileSync(RANKING_FILE);
        memberEntries = JSON.parse(result.toString());
      } catch(err) {
        logger.error('Ranking File Reading Error:');
        logger.error(err);
        interaction.reply('Beep Boop! Unable to read file :peepoSad:');
        return;
      }

      const colAccount: string[] = [];
      const colCharacter: string[] = [];
      const colDepth: number[] = [];

      for (const entry of memberEntries) {
        const rank = entry.rank;
        const accountName = entry.account.name;
        const characterName = entry.character.name;
        const characterClass = entry.character.class;
        const depth = entry.character.depth.default;

        colAccount.push(`${accountName} (${rank})`);
        colCharacter.push(`${characterName} (${characterClass})`);
        colDepth.push(depth);
      }

      const exampleEmbed = {
        color: 0x00ff00,
        title: 'Delve Guild Rankings',
        fields: [
          { name: 'Account', value: colAccount.join('\n'), inline: true },
          { name: 'Character', value: colCharacter.join('\n'), inline: true },
          { name: 'Depth', value: colDepth.join('\n'), inline: true }
        ],
        // timestamp: new Date(),
        footer: {
          text: '____________________________________________________________________________________________________'
        },
      };

      interaction.reply({ embeds: [exampleEmbed] })
    }
  })
  .on('error', (err) => {
    logger.error(`${filename} | ${err}`);
    logger.error(err);
  });

export default client;
