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
        // Função para listar todas as categorias que existem
        Categoria.find().lean().sort({data: 'desc'}).then((categorias) => {
            // Formatar a data antes de passar para o template
            categorias.forEach(categoria => {
                if (categoria.data) {
                    categoria.data = new Date(categoria.data).toLocaleDateString('pt-BR'); // Formato DD/MM/AAAA
                }
            });

            res.render('admin/categorias', {categorias: categorias});
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao listar as categorias");
            res.redirect('/admin');
        });
    });

    // Rota para adicionar categorias
    router.get('/categorias/add', (req, res) => {
        res.render('admin/add-categoria');
    });

    // Rota para efetuar o registro de uma nova categoria
    router.post('/categorias/nova', (req, res) => {

        // Validando formulário
        var erros = [];

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({texto: "Nome inválido"});
        }
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({texto: "Slug inválido"});
        }
        if (req.body.nome.length < 2) {
            erros.push({texto: "Nome da categoria é muito pequeno"});
        }

        if(erros.length > 0) {
            res.render('admin/add-categoria', {erros: erros});
        }
        else {
            // Constante para receber os dados do formulário
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            };

            // Salvando os dados obtido em novaCategoria no BD
            new Categoria(novaCategoria).save().then(() => {
                req.flash('success_msg', "Categoria criada com sucesso!"); // Exibindo mesnagem de sucesso de criação de categoria
                res.redirect('/admin/categorias'); // Redirecionando para a página de listagem de categorias
            }).catch((err) => {
                req.flash('error_msg', "Houve um erro ao salvar a categoria, tente novamente!");  
                res.redirect('/admin');
            });
        }

    });

module.exports = router; //Exportanto constante para permitir o acesso de outros arquivos