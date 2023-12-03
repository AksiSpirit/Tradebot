module.exports = {
    name: 'admin_profiles',
    async execute(interaction, client) {
        let modal = {
            "title": "Профили",
            "custom_id": "admin_profiles",
            "components": [{
                "type": 1,
                "components": [{
                    "type": 4,
                    "custom_id": "id",
                    "label": "ID пользователя",
                    "style": 1,
                    "min_length": 18,
                    "max_length": 19,
                    "placeholder": "000000000000000000",
                    "required": true
                }]
            }]
        }
        interaction.showModal(modal);
    }
}