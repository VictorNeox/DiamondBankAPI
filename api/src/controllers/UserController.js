const connection = require('../database/connection');

module.exports = {

    async Balance(req, res) {
        const bankaccount = req.bankaccount;

        const { value } = await connection('users').select('value').where('bankaccount', bankaccount).first();
        
        return res.status(200).send({ value });
    },

    async Transactions(req, res) {
        const bankaccount = req.bankaccount;

        const transactions = await connection('transactions').select('*').where('accountid', bankaccount);

        if(!transactions) {
            return res.status(404).send({ error: 'User not found' });
        }

        return res.status(200).send(transactions);
    }

}