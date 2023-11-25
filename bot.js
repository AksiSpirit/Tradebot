const { ActivityType, Client, GatewayIntentBits } = require('discord.js');

global.config = JSON.parse(fs.readFileSync('./config.json'));
global.db = require('better-sqlite3')('database.db');

const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	],
});

bot.login(config.token);

bot.on('ready', async () => {
    console.log(`Бот ${bot.user.tag} онлайн`);
	bot.user.setActivity('/start', { type: ActivityType.Watching })
})