module.exports = {
    name: 'admin_add_bal',
    async execute(interaction, client) {
        let modal = {
            "title": "Пополнение баланса",
            "custom_id": "admin_add_bal",
            "components": [{
                "type": 1,
                "components": [
                    {
                        "type": 4,
                        "custom_id": "id",
                        "label": "ID пользователя",
                        "style": 1,
                        "min_length": 18,
                        "max_length": 19,
                        "placeholder": "000000000000000000",
                        "required": true
                    }
                ]
            },
            {
                "type": 1,
                "components": [
                    {
                        "type": 4,
                        "custom_id": "bal",
                        "label": "Сумма пополнения",
                        "style": 1,
                        "min_length": 1,
                        "max_length": 10,
                        "placeholder": "150",
                        "required": true
                    }
                ]
            }]
        }
        interaction.showModal(modal);
    }
}