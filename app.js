// Carregando módulos
const express = require('express'); // Constante para receber o express
const handlebars = require('express-handlebars'); // Constante para receber o express-handlebars
const bodyParser = require('body-parser'); // Constante para receber o body-parser
const app = express(); // Constante que vai receber a função que vem do express
//const mongoose = require('mongoose'); // Constante para receber o mongoose

//Configurações
    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

// Rotas

//Outros
const PORT = 8081; // Constante para receber a porta que será utilizada pelo servidor
// Abrindo um servidor com express
app.listen(PORT, () => {
    console.log("=== Servidor rodando! ===");
})