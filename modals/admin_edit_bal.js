module.exports = {
    name: 'admin_edit_bal',
    async execute(interaction, client, config) {
        await interaction.deferUpdate();
        const id = interaction.fields.fields.get('id').value;
        const bal = interaction.fields.fields.get('bal').value;

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

        db.prepare('UPDATE accounts SET balance = ? WHERE id = ?;').run(bal, id)

        interaction.editReply({
            embeds: [
                {
                    title: "Изменение баланса",
                    description: `Пользователю <@${id}> изменён баланс с ${user.balance} RUB на **${bal} RUB**`
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

        try {
            let userDM = await client.users.createDM(id);
            userDM.send({
                embeds:[
                    {
                        title: 'Изменение баланса',
                        description: `Ваш баланс изменён администратором с ${user.balance} RUB на **${bal} RUB**`,
                        color: 16776960
                    }
                ]
            });
        } catch (err) {console.log(err)} 
    }
}