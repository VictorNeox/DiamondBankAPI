
const connection = require('../database/connection');


const authConfig = require('../config/authConfig.json');
const jwt = require('jsonwebtoken');

function generateToken(bankaccount) {
    return jwt.sign({bankaccount}, authConfig.secret, {
        expiresIn: 86400,
    });
}

module.exports = {
    async Register(req, res) {
        const data = req.body;

        const searchUser = await connection('users').select('*').where('login', data.login).first();

        if(searchUser) {
            return res.status(406).send({ message: 'This login is already been used' });
        }

        await connection('users').insert(data);

        const user = await connection('users').select('*').where('login', data.login).first();

        return res.status(200).send({
            user,
            token: generateToken(user.bankaccount)
        });
    },

    async Authenticate(req, res) {
        const { login, password } = req.body;

        const user = await connection('users').select('*').where('login', login).first();

        if(!user || password !== user.password) {
            return res.status(400).send({ error: 'Username or password is invalid' });
        }

        user.password = undefined;

        return res.status(200).send({
            user,
            token: generateToken(user.bankaccount)
        });
    }
}