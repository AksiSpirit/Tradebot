module.exports = {
    name: 'admin_profiles',
    async execute(interaction, client) {
        await interaction.deferUpdate();
        const id = interaction.fields.fields.get('id').value;

        let dsUser;
        try {
            dsUser = await client.users.fetch(id);
        } catch(e) {
            return interaction.editReply({
                embeds: [
                    {
                        title: "Ошибка",
                        description: "Пользователь не найден!"
                    }
                ],
                ephemeral: true
            })
        }

        let user = getUserById(id);

        let fields = [
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
        ];

        interaction.editReply({
            embeds: [
                {
                    title: "Профиль",
                    description: `Информация о <@${id}>`,
                    fields: fields,
                    thumbnail: {
                        url: dsUser.avatarURL()
                    }
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Назад",
                            emoji: "🔙",
                            style: 1,
                            custom_id: "admin_panel"
                        }
                    ]
                }
            ]
        });
    }
}