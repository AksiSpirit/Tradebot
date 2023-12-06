const { ActivityType, Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

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


async function prepareDb() {
    db.prepare('CREATE TABLE IF NOT EXISTS category (category_value TEXT PRIMARY KEY, category_name TEXT, image_link TEXT, description TEXT, emoji_name TEXT, emoji_id TEXT);').run();
    db.prepare('CREATE TABLE IF NOT EXISTS products (product_value TEXT PRIMARY KEY, category_value TEXT, product_name TEXT, price TEXT);').run();
    db.prepare('CREATE TABLE IF NOT EXISTS accounts (id TEXT PRIMARY KEY, balance REAL, spended INTEGER, buyings INTEGER);').run();
    db.prepare('CREATE TABLE IF NOT EXISTS bills (bill TEXT PRIMARY KEY, user TEXT, sum REAL, status TEXT);').run();
    db.prepare('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);').run();

    let order = db.prepare('SELECT * FROM settings WHERE key = ?;').get('order_index');
    if (!order) {
        db.prepare('INSERT INTO settings (key, value) VALUES (?, ?);').run('order_index', '0');
        global.order = 0;
    } else global.order = order.value;
}

bot.on('ready', async () => {
    prepareDb();
    console.log(`Бот ${bot.user.tag} онлайн`);
	bot.user.setActivity('/start', { type: ActivityType.Watching });
    bot.application.commands.create({ name: "start", description: "Открыть меню" });
    const paymentLoop = require('./loops/qiwi');
    paymentLoop.execute(bot);
    await bot.guilds.cache.get(config.mainServer).members.fetch();
})
bot.login(config.token);


bot.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) return handleCommand(interaction);
    if (interaction.isButton()) return handleButton(interaction);

	if (interaction.isModalSubmit()) return handleModalSubmit(interaction);
    if (interaction.isStringSelectMenu()) return handleStringSelectMenu(interaction);
})



async function handleCommand(interaction) {
    if (interaction.commandName != "start") return;
	let cmd = require("./commands/start");
	cmd.execute(interaction, bot, config);
}

async function handleButton(interaction) {
    let btn = require("./buttons/" + interaction.customId);
    btn.execute(interaction, bot, config);
}

async function handleModalSubmit(interaction) {
    let i;
    if (interaction.customId != "create_category" &&
        interaction.customId != "remove_category" &&
        interaction.customId != "balance_add") {
        i = interaction.customId.split('splesh')[1]; 
    } else {
        i = interaction.customId;
    }
    let modal = require("./modals/" + i);
    modal.execute(interaction, bot, config);
}

async function handleStringSelectMenu(interaction) {
    let menu = require("./selectmenus/" + interaction.customId);
    menu.execute(interaction, bot, config);
}


global.getUserById = function(id) {
    let user = db.prepare('SELECT * FROM accounts WHERE id = ?;').get(id);
    if (user) return user;
    
    db.prepare('INSERT INTO accounts (id, balance, spended, buyings) VALUES (?, 0, 0, 0);').run(id);
    return {id: id, balance: 0, spended: 0, buyings: 0};
}