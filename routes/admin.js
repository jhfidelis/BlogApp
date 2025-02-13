// Carregando módulos
const express = require('express'); // Constante para receber o express
const router = express.Router(); // Constante para gerar rota em arquivo diferente do 'app.js'
const mongoose = require('mongoose'); // Constante para receber o mongoose
require('../models/Categoria'); // Carrega o modelo de dados da Categoria para uso no arquivo
const Categoria = mongoose.model('categorias'); // Constante para acessar a coleção 'categorias' no banco de dados
require('../models/Postagem'); // Carrega o modelo de dados da Postagem para uso no arquivo
const Postagem = mongoose.model('postagens'); // Constante para acessar a coleção 'postagens' no banco de dados

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

    // Rota para redirecionar para página de edição de categoria
    router.get('/categorias/edit/:id', (req, res) => {
        // Recuperar o conteúdo da categoria selecionada
        Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
            res.render('admin/edit-categoria', {categoria: categoria});
        }).catch((err) => {
            req.flash('error_msg', "Essa categoria não existe!");
            res.redirect('/admin/categorias');
        });
    });

    // Rota para aplicar as edições feitas pela categoria
    router.post('/categorias/edit', (req, res) => {

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
 
         if (erros.length > 0) {
            // Retornando os valores salvos no formulário
            res.render('admin/edit-categoria', {
                erros: erros,
                categoria: {
                    _id: req.body.id,
                    nome: req.body.nome,
                    slug: req.body.slug
                }
            });
        }

         else {
            Categoria.findOne({_id: req.body.id}).then((categoria) => {
                categoria.nome = req.body.nome;
                categoria.slug = req.body.slug;
    
                categoria.save().then(() => {
                    req.flash('success_msg', "Categoria editada com sucesso!");
                    res.redirect('/admin/categorias');
                }).catch((err) => {
                    req.flash('error_msg', "Houve um erro interno ao salvar a edição da categoria!");  
                    res.redirect('/admin/categorias');
                });
            }).catch((err) => {
                req.flash('error_msg', "Houve um erro ao editar a categoria");
                res.redirect('/admin/categorias');
            });
         }
    });

    // Rota para deletar uma categoria
    router.post('/categorias/deletar', (req, res) => {
        Categoria.deleteOne({_id: req.body.id}).then(() => {
            req.flash('success_msg', "Catergoria deletada com sucesso!");
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao deletar a categoria");
            res.redirect('/admin/categorias');
        });
    });

    // Rota para exibição das postagens
    router.get('/postagens', (req, res) => {
        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
            res.render('admin/postagens', {postagens: postagens});
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao listar as postagens");
            res.redirect('/admin');
        });
    });

    // Rota para adcionar postagem
    router.get('/postagens/add', (req, res) => {
        Categoria.find().lean().then((categorias) => { // Passando todas as categorias exixtêntes para a view add-postagem
            res.render('admin/add-postagem', {categorias: categorias});
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao carregar a página");
            res.redirect('/admin');
        });
        
    });

    // Rota para efetuar o registro de uma nova postagem
    router.post("/postagens/nova", (req, res) => {
        // Validando erros
        var erros = [];

        if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
            erros.push({texto: "Título inválido"});
        }
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({texto: "Slug inválido"});
        }
        if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
            erros.push({texto: "Descrição inválido"});
        }
        if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
            erros.push({texto: "Conteúdo inválido"});
        }
        
        // Verificando a categoria que o usuário selecionou
        if (req.body.categoria == "0") {
            erros.push({texto: "Categoria inválida! Registre uma categoria para realizar uma postagem."});
        }

        if (erros.length > 0) {
            res.render('admin/add-postagem', {erros: erros});
        } else {
            const novaPostagem = {
                titulo: req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria
            }

            new Postagem(novaPostagem).save().then(() => {
                req.flash("success_msg", "Postagem criada com sucesso!");
                res.redirect("/admin/postagens");
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro durante o salvamento da postagem.");
                console.log(err);
                res.redirect("/admin/postagens");
            });
        }
    });

    // Rota para redirecionar para página de edição de postagem
    router.get('/postagens/edit/:id', (req, res) => {
        // Recuperar o conteúdo da postagem selecionada
        Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
            // Recuperar as categorias no banco de dados
            Categoria.find().lean().then((categorias) => {
                res.render('admin/edit-postagem', {categorias: categorias, postagem: postagem});
            }).catch((err) => {
                req.flash('error_msg', "Houve um erro ao listar as categorias");
                res.redirect('/admin/postagens');
            });

        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao carregar o formulário de edição de postagem");
            res.redirect('/admin/postagens');
        });
   });

   // Rota para aplicar as edições feitas pela categoria
   router.post('/postagens/edit', (req, res) => {
    // Buscando uma postagem que tenha o id igual ao que foi passado na requisição
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        postagem.titulo = req.body.titulo;
        postagem.slug = req.body.slug;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;
        postagem.categoria = req.body.categoria;

        postagem.save().then(() => {
            req.flash('success_msg', "Postagem editada com sucesso");
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', "Erro interno");
            res.redirect('/admin/postagens');
        });
    }).catch((err) => {
        console.log(err);
        req.flash('error_msg', "Houve um erro ao salvar a edição.");
        res.redirect('/admin/postagens');
    });
   });

module.exports = router; //Exportanto constante para permitir o acesso de outros arquivos