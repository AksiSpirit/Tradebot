module.exports = {
    name: 'category',
    async execute(interaction, client, config) {
        const id = interaction.values[0].split('splesh')[1];
        const cid = interaction.values[0].split('splesh')[0];
        if (id == "create_product") {
            const modal = {
                title: "Создание товара",
                custom_id: cid+"splesh"+"create_product",
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                custom_id: "display_name",
                                label: "Название товара (отображаемое)",
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
                                custom_id: "price",
                                label: "Цена товара",
                                style: 1,
                                min_length: 1,
                                max_length: 10,
                                placeholder: "150",
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
                                label: "Название товара (програмное)",
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
        } else if (id == "remove_product") {
            const modal = {
                title: "Удаление товара",
                custom_id: cid+"splesh"+"remove_product",
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                custom_id: "programm_name",
                                label: "Название товара (програмное)",
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
            await interaction.deferUpdate();

            let product = db.prepare('SELECT * FROM products WHERE category_value = ? AND product_value = ?;').get(cid, id);

            interaction.editReply({
                embeds: [
                    {
                        title:product.product_name,
                        description: "Вы уверены что хотите купить данный товар?",
                        fields: [
                            {
                                name: "Стоимость:",
                                value: "```" + product.price + " RUB```",
                                inline: true
                            },
                        ],
                        image: {
                            url: 'https://url.com/' + cid + 'splesh' + product.product_value,
                        },
                        footer: {
                            text: "Выберите действие."
                        }
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Приобрести",
                                style: 1,
                                custom_id: "buy"
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
            })
        }
        
    }
}