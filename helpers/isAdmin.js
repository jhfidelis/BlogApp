// Exportando um middleware de verificação de administrador
module.exports = {
    // Função que verifica se o usuário está autenticado e é administrador
    isAdmin: function(req, res, next) {
        // Verifica se o usuário está autenticado e se possui privilégio de administrador
        if (req.isAuthenticated() && req.user.isAdmin == 1) {
            return next(); // Se for admin, continua a execução da rota normalmente
        }

        // Caso não seja um administrador autenticado, exibe mensagem de erro e redireciona para a página principal
        req.flash('error_msg', "Você deve estar logado como administrador para acessar essa página!");
        res.redirect('/');
    }
}
