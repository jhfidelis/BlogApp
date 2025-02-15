// Carregando módulos
const express = require('express'); // Constante para receber o express
const handlebars = require('express-handlebars'); // Constante para receber o express-handlebars
const bodyParser = require('body-parser'); // Constante para receber o body-parser
const app = express(); // Constante que vai receber a função que vem do express
const admin = require('./routes/admin'); // Constante para receber o arquivo 'admin.js'
const path = require('path'); // Constante para poder trabalhar com diretórios
const mongoose = require('mongoose'); // Constante para receber o mongoose
const session = require('express-session'); //Constante para receber o express-session
const flash = require('connect-flash'); //Constante para receber o connect-flash
require('./models/Postagem'); // Carregando o model de postagens
const Postagem = mongoose.model('postagens') // Constante para declarar o model de postagens

//Configurações

    // Sessão
    app.use(session({
        secret: "cursodenode", // chave para gerar uma sessão
        resave: true, // Força a sessão a ser salva novamente no armazenamento mesmo sem modificações
        saveUninitialized: true // Salva sessões não inicializadas (novas sessões) no armazenamento
    })); // Função usada para criação e configuração de middlewares
    app.use(flash()); // Configurando o flash

    // Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg"); // Variável global para msg de sucesso
        res.locals.error_msg = req.flash("error_msg"); // Variável global para msg de erro
        next();
    });

    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // Template engine (Handlebars)
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

    // Mongoose
    mongoose.Promise = global.Promise; // evitar erros durante o processo de desenvolvimento de uma app
    mongoose.connect("mongodb://localhost/BlogApp").then(() => {
        console.log("MongoDB conectado com sucesso!");
    }).catch((err) => {
        console.log("Houve um erro ao se conectar com o MongoDB: " + err);
    });

    // Public
    app.use(express.static(path.join(__dirname, 'public'))); // Declarar a pasta de arquivos estáticos

// Rotas
    // Rota principal da aplicação
    app.get('/', (req, res) => {
        Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
            res.render('index', {postagens: postagens}); // Renderizando a página principal
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro interno ao carregar as postagens");
            res.redirect('/404');
        });
    });

    // Rota para ser exibida em casos de erro
    app.get('/404', (req, res) => {
        res.send("Erro 404!");
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