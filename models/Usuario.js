const mongoose = require('mongoose'); // Constante para carregar o mongoose
const Schema = mongoose.Schema; // Constante para armazenar a classe Schema do mongoose

// Definindo a collection para Usuario
const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    }
})

// Criando a collection
mongoose.model("usuarios", Usuario);