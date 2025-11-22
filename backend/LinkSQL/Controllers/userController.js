const path = require("path");
const UserModel = require('../Models/userModel');

const UserController = {
    // Função para cadastrar usuário
    cadastrar: async (req, res) => {
        console.log("Entrando no cadastro")
        // req.body é onde chegam os dados do formulário HTML
        const dadosUsuario = req.body;

        // Validação básica antes de chamar o banco
        if (!dadosUsuario.email || !dadosUsuario.Senha || !dadosUsuario.Nick) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: "Preencha todos os campos obrigatórios!" 
            });
        }

        try {
            const resultado = await UserModel.criarUsuario(dadosUsuario);

            if (resultado.sucesso) {
                console.log(`usuario ${dadosUsuario.Nick} criado com suscesso`);
                return res.redirect("/menu_inicial.html");
                // Retorna status 201 (Criado) e o JSON de sucesso
                //res.status(201).json(resultado);
            } else {
                // Retorna status 400 (Erro do cliente/validação)
                res.status(400).json(resultado);
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
        }
    },
    //função para validar login
    login: async (req, res) => {
        console.log("Entrando no login")
        const dadosUsuario = req.body;

        try {
            const resultado = await UserModel.validarLogin(dadosUsuario.Nick, dadosUsuario.Senha);
              if (resultado.sucesso) {
                return res.redirect("/menu_inicial.html");
                // Retorna status 201 (Criado) e o JSON de sucesso
                //res.status(201).json(resultado);
            } else {
                res.redirect("/index_erro.html");
                // Retorna status 400 (Erro do cliente/validação)
                //res.status(400).json(resultado);
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
        }
        },
        //função para criar codigo de recuperação
        recuperar: async (req, res) =>{
            console.log("entrando no recuperar");

            const dadosUsuario = req.body;

            try{
                const resultado = await UserModel.recuperar(dadosUsuario.Nick, dadosUsuario.Email);

                if (!resultado.sucesso){
                    return res.status(400).json(resultado);
                }
                console.log("Código gerado:", resultado.codigo);

                res.sendFile(path.join(__dirname, "../../public/verificar.html"));
            }catch (erro) {
            console.error(erro);
            res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
        }
        },
        //função para verificar o codigo
        verificar: async (req, res) => {
            console.log("verificar codigo");
            const dadosUsuario = req.body;

            try {
                const resultado = await UserModel.verificar(dadosUsuario.codigo);

                if (!resultado.sucesso){
                    return res.status(400).json(resultado);
                }
               return res.redirect("/menu_inicial.html");

            }catch (erro) {
            console.error(erro);
            res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
        }

        }
    
    };

module.exports = UserController;
