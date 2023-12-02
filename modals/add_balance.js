const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');

const qiwiApi = new QiwiBillPaymentsAPI(config.secretKey);
module.exports = {
    name: 'add_balance',
    async execute(interaction, client) {

        const billId = qiwiApi.generateId();
        let sum = parseInt(interaction.fields.fields.get('count').value.replace(/[^+\d]/g, ""));
        if (!sum) interaction.reply({ embeds: [{title:"Ошибка", description: "Сумма указана не верно!"}] })
        const expire = qiwiApi.getLifetimeByDay((1/86400)*60*30);
        const fields = {
            amount: sum,
            currency: 'RUB',
            comment: 'Пополнение баланса',
            expirationDateTime: expire,
            email: 'none@gmail.com',
            account : 'none'
        };

        let data = await qiwiApi.createBill(billId, fields)
        const link = data.payUrl;
        
        db.prepare('INSERT INTO bills (bill, user, sum, status) VALUES (?, ?, ?, ?)').run(billId, interaction.user.id, sum, 'WAITING');

        interaction.update(
            {
                embeds:[
                    {
                        title:"Пополнение баланса",
                        description: "Счёт для оплаты отправлен вам в личные сообщения!"
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
                                custom_id: "profile"
                            }
                        ]
                    }
                ]
            }
        )

        try {
            let userDM = await client.users.createDM(interaction.user.id);
            userDM.send({
                embeds:[
                    {
                        title: 'Счёт на оплату',
                        description: `Для оплаты счёта ${billId} на сумму **${sum} RUB** нажмите на кнопку снизу!\nНа оплату даётся 30 минут, после чего счёт будет отменён!\n\nЕсли вы не получили сообщение о пополнении счёта в течение 10 минут с момента оплаты, обратитесь к обладателям роли @Кодер на сервере бота`,
                        color: 16776960
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
                                style: 5,
                                url: link
                            }
                        ]
                    }
                ]
            });
        } catch (err) {console.log(err)}
    }
}