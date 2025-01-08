// Carregando módulos
const express = require('express'); // Constante para receber o express
const router = express.Router(); // Constante para gerar rota em arquivo diferente do 'app.js'
const mongoose = require('mongoose'); // Constante para receber o mongoose
require('../models/Categoria'); // Carrega o modelo de dados da Categoria para uso no arquivo
const Categoria = mongoose.model('categorias'); // Constante para acessar a coleção 'categorias' no banco de dados

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

    // Rota para efetuar o registro de uma nova categoria
    router.post('/categorias/nova', (req, res) => {
        // Constante para receber os dados do formulário
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        };

        // Salvando os dados obtido em novaCategoria no BD
        new Categoria(novaCategoria).save().then(() => {
            console.log("Categoria cadastrada com sucesso!");
        }).catch((err) => {
            console.log("Erro ao cadastrar categoria: " + err);
        });
    });

module.exports = router; //Exportanto constante para permitir o acesso de outros arquivos