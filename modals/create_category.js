module.exports = {
    name: "create_category",
    async execute(interaction, client) {
        const name = interaction.fields.fields.get('display_name').value;
        const id = interaction.fields.fields.get('programm_name').value;
        const imageLink = interaction.fields.fields.get('image_link').value;
        const description = interaction.fields.fields.get('description').value;
        let categoryList = db.prepare('SELECT * FROM category;').all();
        let i = 0;
        while (categoryList.length > i) {
            const c = categoryList[i];
            if (c.category_value == id) {
                return interaction.update({ 
                    embeds:[
                        {
                            title: "Невозможно создать категорию",
                            description: "Указанное програмное название категории идентично с **" + с.category_name + "**"
                        }
                    ],
                    ephemeral: true 
                })
            }
            i++;
        }
        if (id == "create_category") {
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


        db.prepare('INSERT INTO category (category_value, category_name, image_link, description) VALUES (?, ?, ?, ?);').run(id, name, imageLink, description);
        categoryList = db.prepare('SELECT * FROM category;').all();
        
        i = 0;
        let selectmenu = [];
        while (i < categoryList.length) {
            let c = categoryList[i];
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
        interaction.update({
            embeds: [
                {
                    title: "Покупка",
                    description: "Выберите категорию товаров ниже",
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: "category",
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
                            custom_id: "main"
                        }
                    ]
                }
            ]
        });
    }
}