module.exports = {
    name: "start",
    async execute(interaction, client, config) {
        let buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: "Магазин",
                    emoji: "🛒",
                    style: 1,
                    custom_id: "shop"
                },
                {
                    type: 2,
                    label: "Профиль",
                    emoji: "👤",
                    style: 1,
                    custom_id: "profile"
                }
            ]
        };
        if (config.admins.find(u => u.userid == interaction.user.id)) {
            buttons.components.push(
                {
                    type: 2,
                    label: "Админ панель",
                    emoji: "🤖",
                    style: 1,
                    custom_id: "admin_panel"
                }
            )
        }
        interaction.update({
            files:[],
            embeds: [
                {
                    title: "Меню",
                    description: "Выберите один из пунктов предложеных ниже"
                }
            ],
            components: [buttons]
        });
    }
}