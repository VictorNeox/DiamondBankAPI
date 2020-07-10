
const connection = require('../database/connection');

module.exports = {
    async Transfer(req, res) {
        const data = req.body;
        const bankaccount = req.bankaccount;

        if(data.value <= 0) {
            return res.send({ error: 'We dont accept zero or negative numbers'});
        }

        const { value } = await connection('users').select('value').where('bankaccount', bankaccount).first();

        if(value < data.value) {
            return res.status(404).send({ error: 'You dont have enough balance' });
        }


        const user = await connection('users').increment({ value: data.value }).where('bankaccount', data.receiver);
        if(!user) {
            return res.status(404).send({ error: 'This account dont exists'});
        }

        await connection('users').decrement({ value: data.value }).where('bankaccount', bankaccount);

        await connection('transactions').insert({
            value: data.value,
            receiver: data.receiver,
            accountid: bankaccount
        });
        

        return res.status(200).send({ message: 'Transaction successful' });
    }
}