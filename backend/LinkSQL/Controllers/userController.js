const UserModel = require('../Models/userModel');

const UserController = {
    // Função para cadastrar usuário
    cadastrar: async (req, res) => {
        // req.body é onde chegam os dados do formulário HTML
        const dadosUsuario = req.body;

        // Validação básica antes de chamar o banco
        if (!dadosUsuario.Nome || !dadosUsuario.Senha || !dadosUsuario.Nick) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: "Preencha todos os campos obrigatórios!" 
            });
        }

        try {
            const resultado = await UserModel.criarUsuario(dadosUsuario);

            if (resultado.sucesso) {
                // Retorna status 201 (Criado) e o JSON de sucesso
                res.status(201).json(resultado);
            } else {
                // Retorna status 400 (Erro do cliente/validação)
                res.status(400).json(resultado);
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
        }
    }

};

module.exports = UserController;