const mongoose = require('mongoose'); // Constante para carregar o mongoose
const Schema = mongoose.Schema; // Constante para armazenar a classe Schema do mongoose

// Definindo a collection para Categoria
const Categoria = new Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
});

// Criando a collection
mongoose.model("categorias", Categoria);