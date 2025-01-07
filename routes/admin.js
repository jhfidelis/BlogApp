// Carregando módulos
const express = require('express'); // Constante para receber o express
const router = express.Router(); // Constante para gerar rota em arquivo diferente do 'app.js'

// Definido rotas
    // Rota principaldo administrador
    router.get('/', (req, res) => {
        res.send("Página inicial do administrador");
    });

    // Rota para listagem de posts
    router.get('/posts', (req, res) => {
        res.send("Página de posts");
    });

    // Rota para cadastrar categorias
    router.get('/categorias', (req, res) => {
        res.send("Página de categorias");
    });

module.exports = router; //Exportanto constante para permitir o acesso de outros arquivos