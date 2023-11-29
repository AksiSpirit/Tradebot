module.exports = {
    name: 'profile',
    async execute(interaction, client) {
        await interaction.deferUpdate();

        let user = getUserById(interaction.user.id);

        interaction.editReply({
            embeds: [
                {
                    title: "Профиль",
                    description: "Информация о вас",
                    fields: [
                        {
                            name: "Баланс аккаунта",
                            value: "```"+ user.balance +" RUB```",
                            inline: true
                        },
                        {
                            name: "Всего потрачено",
                            value: "```"+ user.spended +" RUB```",
                            inline: true
                        },
                        {
                            name: "Куплено товаров",
                            value: "```"+ user.buyings +" шт.```",
                            inline: true
                        }
                    ],
                    thumbnail: {
                        url: interaction.user.avatarURL()
                    }
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Пополнить баланс",
                            emoji: "💰",
                            style: 1,
                            custom_id: "add_balance"
                        },
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