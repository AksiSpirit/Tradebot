const fs = require('fs');
module.exports = {
    name: "panel",
    async execute(interaction, client) {
        let buttons1 = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: "Профили",
                    emoji: "📄",
                    style: 1,
                    custom_id: "admin_profiles"
                },
                {
                    type: 2,
                    label: "Изменить баланс",
                    emoji: "💰",
                    style: 1,
                    custom_id: "admin_edit_bal"
                },
                {
                    type: 2,
                    label: "Пополнить баланс",
                    emoji: "💰",
                    style: 1,
                    custom_id: "admin_add_bal"
                }
            ]
        };

        let buttons2 = {
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

        interaction.update({
            embeds: [
                {
                    title: "Панель администратора",
                    description: "Нажмите на кнопки ниже чтобы взаймодействовать!"
                }
            ],
            components: [
                buttons1,
                buttons2
            ],
            files: []
        })
    }
}