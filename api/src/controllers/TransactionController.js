const jwt = require('jsonwebtoken');

const authConfig = require('../config/authConfig.json');
const connection = require('../database/connection');

module.exports = {
    async Transfer(req, res) {
        const data = req.body;
        const token = req.headers.authorization;

        jwt.verify(token, authConfig.secret, async (err, decoded) => {
            if(err) return res.send(401).send( { error: 'Invalid Token' });

            data.bankaccount = decoded.bankaccount;


            const balance = await connection('users').select('value').where('bankaccount', data.bankaccount).first();

            
            if(balance.value < data.value) {
                return res.status(404).send({ message: 'You dont have enough balance' })
            }

            const user = await connection('users').increment({ value: data.value }).where('bankaccount', data.receiver);
            if(!user) {
                return res.status(404).send({ error: 'This account dont exists'});
            }

            await connection('users').decrement({ value: data.value }).where('bankaccount', data.bankaccount);

            await connection('transactions').insert({
                value: data.value,
                receiver: data.receiver,
                accountid: data.bankaccount
            });
            

            return res.status(200).send({ message: 'Transaction successful' });
        })
    }
}