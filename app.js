// Carregando módulos
const express = require('express'); // Constante para receber o express
const handlebars = require('express-handlebars'); // Constante para receber o express-handlebars
const bodyParser = require('body-parser'); // Constante para receber o body-parser
const app = express(); // Constante que vai receber a função que vem do express
const admin = require('./routes/admin'); // Constante para receber o arquivo 'admin.js'
//const mongoose = require('mongoose'); // Constante para receber o mongoose

//Configurações
    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // Template engine (Handlebars)
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

// Rotas
    // Rota principal da aplicação
    app.get('/', (req, res) => {
        res.send("Rota principal");
    });

    // Rota para listagem de posts
    app.get('/posts', (req, res) => {
        res.send("Lista de Posts");
    });

    // Criando um 'prefixo' para rota admin
    app.use('/admin', admin);

//Outros
const PORT = 8081; // Constante para receber a porta que será utilizada pelo servidor
// Abrindo um servidor com express
app.listen(PORT, () => {
    console.log("=== Servidor rodando! ===");
})