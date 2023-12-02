const schedule = require('node-schedule');
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const config = global.config;
const qiwiApi = new QiwiBillPaymentsAPI(config.secretKey);
let client;
module.exports = {
    name: 'loop',
    async execute(bot) {
        client = bot;
        checkPayments();
        const job = schedule.scheduleJob('*/5 * * * *', async function() {
            checkPayments();
        });
    }
}

async function checkPayments() {
    let waitingBills = db.prepare('SELECT * FROM bills WHERE status = ?;').all('WAITING');
    for (let bill of waitingBills) {
        const billInfo = await qiwiApi.getBillInfo(bill.bill);
        if (billInfo.status.value == 'WAITING') continue;
        if (billInfo.status.value == 'PAID') handlePaid(bill);
        if (billInfo.status.value == 'REJECTED') handleRejected(bill);
        if (billInfo.status.value == 'EXPIRED') handleExpired(bill);
    }
}

async function handlePaid(bill) {
    db.prepare('UPDATE bills SET status = ? WHERE bill = ?;').run('PAID', bill.bill);
    let user = getUserById(bill.user);
    let newBal = user.balance + bill.sum;
    db.prepare('UPDATE accounts SET balance = ? WHERE id = ?;').run(newBal, bill.user);
    try {
        let userDM = await client.users.createDM(bill.user);
        userDM.send({
            embeds:[
                {
                    title: 'Платёж завершён',
                    description: `Платеж ${bill.bill} на сумму **${bill.sum} RUB** успешно завершён!\nВаш текущий баланс **${newBal}** RUB\nСпасибо за пополнение!`,
                    color: 65280
                }
            ]
        });
    } catch {}

    let paymentLogChannel = client.channels.cache.get(config.incomeNotificationChannel);
    paymentLogChannel.send({
        embeds:[
            {
                title: 'Пополнение',
                description: `<@${bill.user}> пополнил баланс на сумму **${bill.sum} RUB**\nПлатеж ${bill.bill}`,
                color: 65280
            }
        ]
    });
}

async function handleRejected(bill) {
    db.prepare('UPDATE bills SET status = ? WHERE bill = ?;').run('REJECTED', bill.bill);
    try {
        let userDM = await client.users.createDM(bill.user);
        userDM.send({
            embeds:[
                {
                    title: 'Ошибка платежа',
                    description: `Платеж ${bill.bill} на сумму **${bill.sum} RUB** отклонён платёжной системой!`,
                    color: 16711680
                }
            ]
        });
    } catch {}
}

async function handleExpired(bill) {
    db.prepare('UPDATE bills SET status = ? WHERE bill = ?;').run('EXPIRED', bill.bill);
    try {
        let userDM = await client.users.createDM(bill.user);
        userDM.send({
            embeds:[
                {
                    title: 'Отмена платежа',
                    description: `Счёт ${bill.bill} на сумму **${bill.sum} RUB** отменён, поскольку не был оплачен в течение 30 минут!`,
                    color: 255
                }
            ]
        });
    } catch {}
}