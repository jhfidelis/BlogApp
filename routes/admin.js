// Carregando módulos
const express = require('express'); // Constante para receber o express
const router = express.Router(); // Constante para gerar rota em arquivo diferente do 'app.js'

// Definido rotas
    // Rota principaldo administrador
    router.get('/', (req, res) => {
        res.render('admin/index'); // Retorna página 'index.handlebars'
    });

    // Rota para listagem de posts
    router.get('/posts', (req, res) => {
        res.send("Página de posts");
    });

    // Rota para listar categorias
    router.get('/categorias', (req, res) => {
        res.render('admin/categorias');
    });

    // Rota para adicionar categorias
    router.get('/categorias/add', (req, res) => {
        res.render('admin/add-categoria');
    });

module.exports = router; //Exportanto constante para permitir o acesso de outros arquivos