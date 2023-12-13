const { PermissionFlagsBits } = require('discord.js');
const config = global.config;
module.exports = {
    name: 'category',
    async execute(interaction, client) {
        await interaction.deferUpdate();
        let getter = interaction.message.embeds[0].image.url.split("https://url.com/").join("");
        const id = getter.split('splesh')[1];
        const cid = getter.split('splesh')[0];

        let product = db.prepare('SELECT * FROM products JOIN category ON products.category_value = category.category_value WHERE products.product_value = ? AND products.category_value = ?;').get(id, cid);

        let user = getUserById(interaction.user.id);

        if (user.balance < product.price) return interaction.editReply({
            embeds: [
                {
                    title: "Не возможно купить данный товар",
                    description: "У вас **недостаточно средств**!"
                }
            ],
            components: []
        });


        interaction.editReply(
            {
                embeds: [
                    {
                        title: "Спасибо за покупку",
                        description: "Вы успешно оплатили **данный товар**! Через пару секунд будет создан канал, в котором продавец сможет выдать вам товар!",
                        image: {
                            url: 'https://url.com/' + cid + 'splesh' + product.product_value,
                        },
                    }
                ]
            }
        );

        let bal = user.balance - product.price;
        let buyings = user.buyings + 1;
        let spended = parseInt(user.spended) + parseInt(product.price);
        let localOrder = parseInt(order) + 1;
        global.order = localOrder;

        db.prepare('UPDATE settings SET value = ? WHERE key = ?;').run(localOrder, 'order_index');
        db.prepare('UPDATE accounts SET balance = ?, buyings = ?, spended = ? WHERE id = ?;').run(bal, buyings, spended, interaction.user.id);

        let guild = client.guilds.cache.get(config.mainServer);
        let channel = await guild.channels.create({
            name: `Заказ #${localOrder}`,
            parent: config.orderCategory,
            permissionOverwrites: [
                {
                    id: interaction.user.id, // buyer
                    allow: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: config.sellerRole, // seller role
                    allow: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: config.mainServer, // @everyone
                    deny: [PermissionFlagsBits.ViewChannel]
                }
            ],
        });

        channel.send({
            content: `<@${user.id}>\n<@&${config.sellerRole}>`,
            embeds: [
                {
                    title: 'Сведения',
                    description: `Категория: ${product.category_name}\nТовар: ${product.product_name}\nСумма: ${product.price}`
                }
            ],
        })
    }
}