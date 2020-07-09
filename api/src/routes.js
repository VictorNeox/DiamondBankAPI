const express = require('express');
const connection = require('./database/connection');
const routes = express.Router();

const AuthController = require('./controllers/AuthController');
const TransactionController = require('./controllers/TransactionController');
const { client } = require('./database/connection');

routes.get('/', (req, res) => {
    return res.send({ message: 'Rota acessada com sucesso' });
});

routes.post('/user/register', AuthController.Register);
routes.post('/user/authenticate', AuthController.Authenticate);
routes.post('/user/transfer', TransactionController.Transfer);

routes.get('/list', async (req, res) => {
    const users = await connection('users').select('*');

    return res.send(users);
})

routes.delete('/delete', async (req, res) => {
    const users = await connection('users').select('*').del();

    return res.send('usuários deletados!');
})


module.exports = routes;