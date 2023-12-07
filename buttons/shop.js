module.exports = {
    name: "shop",
    async execute(interaction, client) {
        await interaction.deferUpdate();
        let category = db.prepare('SELECT * FROM category;').all();
        let i = 0;
        let selectmenu = [];
        while (i < category.length) {
            let c = category[i];
            if (config.admins.find(u => u.userid == interaction.user.id)) {
                let el = {
                    label: c.category_name,
                    value: c.category_value,
                    description: "Програмное название: " + c.category_value
                };

                if (c.emoji_name) {
                    el.emoji = {
                        name: c.emoji_name,
                        id: c.emoji_id
                    }
                }

                selectmenu.push(el);
            } else {
                let el = {
                    label: c.category_name,
                    value: c.category_value,
                };

                if (c.emoji_name) {
                    el.emoji = {
                        name: c.emoji_name,
                        id: c.emoji_id
                    }
                }

                selectmenu.push(el);
            }
            i++;
        }
        if (config.admins.find(u => u.userid == interaction.user.id)) {
            selectmenu.push(
                {
                    label: "Создать категорию",
                    value: "create_category",
                },
                {
                    label: "Удалить категорию",
                    value: "remove_category",
                }
            );
        }
        interaction.editReply({
            embeds: [
                {
                    title: "Покупка",
                    description: "Выберите категорию товаров ниже"
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: "category",
                            placeholder: "Выберите категорию",
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
                            custom_id: "main"
                        }
                    ]
                }
            ]
        })
    }
}