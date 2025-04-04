const localStrategy = require('passport-local'); // Constante para carregar a estratégia local do passport
const mongoose = require('mongoose'); // Constante para carregar o mongoose
const bcrypt = require('bcryptjs'); // Constante para carregar o bcrypt

// Carregando o model de usuário
require('../models/Usuario'); // Carrega o modelo de dados do Usuario para uso no arquivo
const Usuario = mongoose.model('usuarios'); // Constante para acessar a coleção 'usuarios' no banco de dados

// Configuração do sistema de autenticação
module.exports = function(passport) {

    passport.use(new localStrategy({usernameField: 'email'}, (email, senha, done) => {
        // Busca o usuário no banco de dados pelo email
        Usuario.findOne({email: email}).lean().then((usuario) => {
            
            if (!usuario) {
                return done(null, false, {message: "Esta conta não existe"});
            }

            // Compara a senha informada com a senha armazenada no banco
            bcrypt.compare(senha, usuario.senha, (erro, senhaCorreta) => {
                if(senhaCorreta) {
                    return done(null, user); // Se a senha estiver correta, autentica o usuário
                } else {
                    return done(null, false, {message: "Senha incorreta"});
                }
            })

        });
    }));

    // // Salva o ID do usuário na sessão
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    // Recupera os dados do usuário a partir do ID salvo na sessão
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, usuario) => {
            done(err, user)
        });
    });

}