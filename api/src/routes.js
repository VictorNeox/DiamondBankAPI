const express = require('express');
const connection = require('./database/connection');
const routes = express.Router();

const AuthController = require('./controllers/AuthController');
const TransactionController = require('./controllers/TransactionController');
const authMiddleware = require('./middlewares/auth');

routes.get('/', (req, res) => {
    return res.send({ message: 'Rota acessada com sucesso' });
});

routes.post('/user/register', AuthController.Register);
routes.post('/user/authenticate', AuthController.Authenticate);
routes.post('/user/transfer', authMiddleware, TransactionController.Transfer);

routes.get('/list', async (req, res) => {
    const users = await connection('users').select('*');

    return res.send(users);
});

routes.get('/transactions/list', async (req, res) => {
    const transactions = await connection('transactions').select('*');

    return res.send(transactions);
});

routes.delete('/delete', async (req, res) => {
    await connection('users').select('*').del();
    await connection('transactions').select('*').del();


    return res.send('usuários deletados!');
});


module.exports = routes;