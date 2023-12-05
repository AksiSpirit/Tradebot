module.exports = {
    name: 'create_product',
    async execute(interaction, client) {
        const name = interaction.fields.fields.get('display_name').value;
        const price = interaction.fields.fields.get('price').value;
        const val = interaction.fields.fields.get('programm_name').value;
        const id = interaction.customId.split('splesh')[1];
        const cid = interaction.customId.split('splesh')[0];

        let category = db.prepare('SELECT * FROM category WHERE category_value = ?;').get(cid);

        let products = db.prepare('SELECT * FROM products WHERE category_value = ?;').all(cid);

        let i = 0;
        if (products.length > i) {
            while (products.length > i) {
                const c = products[i];
                if (c.value == val) {
                    return interaction.update({ 
                        embeds:[
                            {
                                title: "Невозможно создать товар",
                                description: "Указанное програмное название товара идентично с **" + c.product_name + "**"
                            }
                        ],
                        ephemeral: true 
                    })
                }
                i++;
            }
        }
        if (id == "create_product" && id == "remove_product" && id == "move_product" && id == "add_product") {
            return interaction.update({ 
                embeds:[
                    {
                        title: "Невозможно создать категорию",
                        description: "Указанное програмное название категории идентично с **зарезервированым системным знаком**!"
                    }
                ],
                ephemeral: true 
            })
        }

        db.prepare('INSERT INTO products (product_value, category_value, product_name, price) VALUES (?, ?, ?, ?)').run(val, cid, name, parseInt(price));

        products = db.prepare('SELECT * FROM products WHERE category_value = ?;').all(cid);
        let description = [];
        if (category.description && category.description != '') description.push(category.description);
        for(let i = 0; i < products.length; i++) {
            const p = products[i];
            if (config.admins.find(u => u.userid == interaction.user.id)) {
                description.push(`**${p.product_name}**\nЦена: **${p.price} RUB**\nПрограмное название: **${p.product_value}**`);
            } else {
                description.push(`**${p.product_name}**\nЦена: **${p.price} RUB**`);
            }
        }
        description = description.join('\n\n');
        let selectmenu = [];
        for(let i = 0; i < products.length; i++) {
            const p = products[i];
            selectmenu.push(
                {
                    label: p.product_name,
                    description: `Цена: ${p.price} RUB`,
                    value: cid+"splesh"+p.product_value
                }
            );
        }
        if (config.admins.find(u => u.userid == interaction.user.id)) {
            selectmenu.push(
                {
                    label: "Создать товар",
                    value: cid+"splesh"+"create_product",
                },
                {
                    label: "Удалить товар",
                    value: cid+"splesh"+"remove_product",
                },
            );
        }
        interaction.update({
            embeds: [
                {
                    title: category.category_name,
                    description: description,
                    image: {url: category.image_link}
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: "products",
                            placeholder: "Выберите товар",
                            options: selectmenu,
                            min_values: 1,
                            max_values: 1
                        },
                        
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Назад",
                            emoji: "🔙",
                            style: 1,
                            custom_id: "shop"
                        }
                    ]
                }
            ]
        });
    }
}