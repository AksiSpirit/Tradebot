module.exports = {
    name: 'add',
    async execute(interaction, client) {
        let modal = {
            "title": "Пополнение баланса",
            "custom_id": "add_balance",
            "components": [{
                "type": 1,
                "components": [{
                    "type": 4,
                    "custom_id": "count",
                    "label": "Сумма пополнения",
                    "style": 1,
                    "min_length": 1,
                    "max_length": 20,
                    "placeholder": "150",
                    "required": true
                }]
            }]
        }
        interaction.showModal(modal);
    }
}