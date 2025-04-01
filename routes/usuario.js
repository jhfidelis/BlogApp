// Carregando módulos
const express = require('express'); // Constante para receber o express
const router = express.Router(); // Constante para gerar rota em arquivo diferente do 'app.js'
const mongoose = require('mongoose'); // Constante para receber o mongoose
require('../models/Usuario'); // Carrega o modelo de dados do Usuario para uso no arquivo
const Usuario = mongoose.model('usuarios'); // Constante para acessar a coleção 'usuarios' no banco de dados
const bcrypt = require('bcryptjs'); // Constante para importar o bcrypt

// Rota para renderizar uma view
router.get('/registro', (req, res) => {
    res.render('usuarios/registro');
});

// Rota para realizar a validação do formulário de criação de conta
router.post('/registro', (req, res) => {
    var erros = [];

    // verificando possíveis erros
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome inválido"});
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: "E-mail inválido"});
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto: "Senha inválida"});
    }
    
    if (req.body.senha < 6) {
        erros.push({texto: "Sua senha deve ter no mínimo 6 dígitos"});
    }
    
    if (req.body.senha != req.body.senha2) {
        erros.push({texto: "As senhas não coincidem"});
    }

    // Exibindo os erros existentes
    if (erros.length > 0) {
        res.render('usuarios/registro', {erros: erros});
    } else {
        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            // Verificar se  já existe um usuário com o e-mail a ser cadastrado
            if (usuario) {
                req.flash('error_msg', "Já existe uma conta com esse e-mail");
                res.redirect('/usuarios/registro');
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                });

                // Criptografando a senha
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro) {
                            req.flash('error_msg', "Houve um erro ao cadastrar o usuário");
                            res.redirect('/');
                        } else {
                            novoUsuario.senha = hash; // Hash sendo inserido no campo senha

                            novoUsuario.save().then(() => {
                                req.flash('success_msg', "Usuário cadastrado com sucesso!");
                                res.redirect('/');
                            }).catch((err) => {
                                req.flash('error_msg', "Houve um erro ao cadastrar o usuário, tente novamente");
                                res.redirect('/usuarios/registro');
                            });
                        }
                    });
                });
            }
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro interno");
            res.redirect('/');
        });
    }

});

module.exports = router; // Exportanto constante para permitir o acesso de outros arquivos