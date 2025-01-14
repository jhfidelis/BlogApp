const mongoose = require('mongoose'); // Constante para carregar o mongoose
const Schema = mongoose.Schema; // Constante para armazenar a classe Schema do mongoose

// Definindo a collection para Categoria
const Postagem = new Schema ({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId, // O atributo categoria irá armazenar o ID de um objeto
        ref: "categorias",// Referenciando o atributo com a tabela de categorias
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("postagens", Postagem);