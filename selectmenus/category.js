module.exports = {
    name: 'category',
    async execute(interaction, client, config) {
        const id = interaction.values[0];
        if (id == "create_category") {
            const modal = {
                title: "Создание категории",
                custom_id: "create_category",
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                custom_id: "display_name",
                                label: "Название категории (отображаемое)",
                                style: 1,
                                min_length: 1,
                                max_length: 100,
                                placeholder: "Discord Nitro (с гарантией)",
                                required: true
                            }
                        ]
                    },
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                custom_id: "programm_name",
                                label: "Название категории (програмное)",
                                style: 1,
                                min_length: 1,
                                max_length: 100,
                                placeholder: "discordnitro_garant",
                                required: true
                            }
                        ]
                    },
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                custom_id: "image_link",
                                label: "Ссылка на изображение для категории (необяз.)",
                                style: 1,
                                min_length: 1,
                                max_length: 255,
                                placeholder: "https://cdn.discordapp.com/attachments/1089998305318158377/1090007279736209509/ams_ember.gif",
                                required: false
                            }
                        ]
                    },
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                custom_id: "description",
                                label: "Описание категории (необяз.)",
                                style: 1,
                                min_length: 1,
                                max_length: 255,
                                placeholder: "При окончании Nitro раньше времени оно будет выдано снова",
                                required: false
                            }
                        ]
                    }
                ]
            }
            interaction.showModal(modal);
        } else if (id == "remove_category") {
            const modal = {
                title: "Удаление категории",
                custom_id: "remove_category",
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                custom_id: "programm_name",
                                label: "Название категории (програмное)",
                                style: 1,
                                min_length: 1,
                                max_length: 100,
                                placeholder: "discordnitro_garant",
                                required: true
                            }
                        ]
                    }
                ]
            }
            interaction.showModal(modal);
        } else {
            let category = db.prepare('SELECT * FROM category WHERE category_value = ?;').get(id);
            let products = db.prepare('SELECT * FROM products WHERE category_value = ?;').all(id);
            let description = [];
            if (category.description && category.description != '') description.push(category.description);
            for(let i = 0; i < products.length; i++) {
                const p = products[i];
                if (config.admins.find(u => u.userid == interaction.user.id)) {
                    description.push(`**${p.product_name}**\nЦена: **${p.price} RUB**\nПрограмное название: **${p.product_value}**`);
                } else {
                    description.push(`**${p.product_name}**\nЦена: **${p.price} RUB**`)
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
                        value: category.category_value+"splesh"+p.product_value
                    }
                );
            }
            if (config.admins.find(u => u.userid == interaction.user.id)) {
                selectmenu.push(
                    {
                        label: "Создать товар",
                        value: category.category_value+"splesh"+"create_product",
                    },
                    {
                        label: "Удалить товар",
                        value: category.category_value+"splesh"+"remove_product",
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
}
