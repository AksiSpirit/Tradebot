module.exports = {
    name: 'admin_add_bal',
    async execute(interaction, client) {
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

        if (bal <= 0) {
            return interaction.editReply({
                embeds: [
                    {
                        title: "Ошибка",
                        description: "Некорректная сумма!"
                    }
                ],
                ephemeral: true
            })
        }

        let user = getUserById(id);

        let newBal = parseFloat(bal) + parseFloat(user.balance);

        db.prepare('UPDATE accounts SET balance = ? WHERE id = ?;').run(newBal, id);

        interaction.editReply({
            embeds: [
                {
                    title: "Ручное пополнение баланса",
                    description: `Баланс пользователя <@${id}> пополнен на **${bal} RUB**`
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
                        title: 'Пополнение баланса',
                        description: `Ваш баланс пополнен администратором на **${bal} RUB**`,
                        color: 16776960
                    }
                ]
            });
        } catch (err) {console.log(err)}
    }
}