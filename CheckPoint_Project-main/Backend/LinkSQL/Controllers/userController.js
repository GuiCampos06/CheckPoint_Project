const path = require("path");
const UserModel = require('../Models/userModel');

const UserController = {
    // Função para cadastrar usuário
    cadastrar: async (req, res) => {
        console.log("Entrando no cadastro")
        // req.body é onde chegam os dados do formulário HTML
        const dadosUsuario = req.body;

        // Validação básica antes de chamar o banco
        if (!dadosUsuario.email || !dadosUsuario.senha || !dadosUsuario.Nick) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: "Preencha todos os campos obrigatórios!" 
            });
        }

        try {
            const resultado = await UserModel.criarUsuario(dadosUsuario);

            if (resultado.sucesso) {
                req.session.usuarioLogado = resultado.usuario;
                req.session.save(() => {
                return res.redirect("/menu_inicial.html");
                });
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
        const dadosUsuario = req.body;  
        console.log("Tentando logar com:", dadosUsuario.Nick); 

    try {
        const resultado = await UserModel.validarLogin(dadosUsuario.Nick, dadosUsuario.senha);
        
        if (resultado.sucesso) {
            req.session.usuarioLogado = resultado.usuario;
            req.session.save(() => {
                return res.redirect("/menu_inicial.html");
            });
        } else {
            // Se deu errado, manda pra tela de erro
            res.redirect("/index_erro.html");
        }
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro no servidor" });
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

        },
        editar_perfil: async (req, res) => {
        console.log("Entrando no editar_perfil")
        // req.body é onde chegam os dados do formulário HTML
        const dadosUsuario = req.body;
        const idUser = req.session.usuarioLogado.pk_id;
        // Validação básica antes de chamar o banco
        if (!dadosUsuario.email || !dadosUsuario.senha || !dadosUsuario.Nick) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: "Preencha todos os campos obrigatórios!" 
            });
        }

        try {
            const resultado = await UserModel.editar_perfil(dadosUsuario, idUser);
            

            if (resultado.sucesso) {
                console.log(`usuario ${dadosUsuario.Nick} Atualizado com suscesso`);

                req.session.usuarioLogado.Nick = dadosUsuario.Nick;
                req.session.usuarioLogado.email = dadosUsuario.email;
                req.session.usuarioLogado.Nome = dadosUsuario.Nome;
                req.session.usuarioLogado.Idade = dadosUsuario.Idade;
                req.session.usuarioLogado.Valor = dadosUsuario.Valor;
                req.session.save(() => {

                return res.redirect("/menu_inicial.html?sucesso=1");
                
            });
            } else {
                // Retorna status 400 (Erro do cliente/validação)
                res.status(400).json(resultado);
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
        }
    },
    saldo: async (req, res) => {

    console.log("Sessão atual:", req.session);

    if (!req.session.usuarioLogado) {
        return res.status(403).json({ sucesso: false, mensagem: "Usuário não está logado" });
    }
        const {Valor} = req.body;
        const idUser = req.session.usuarioLogado.pk_id;

        try {
            const resultado = await UserModel.saldo(Valor, idUser);
            if (resultado.sucesso) {
                console.log(`usuario ${idUser} Saldo atualizado com sucesso com suscesso`);
                req.session.usuarioLogado.Valor = Valor;
                req.session.save(() => {

                return res.redirect("/menu_inicial.html?sucesso=2");
                
            });
            } else {
                // Retorna status 400 (Erro do cliente/validação)
                res.status(400).json(resultado);
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
        }
    },
    saldo: async (req, res) => {
        // Se não tiver logado, bloqueia
        if (!req.session.usuarioLogado) {
            return res.status(403).json({ ok: false, msg: "Usuário não logado" });
        }

        const { Valor } = req.body; // Recebe o novo valor do input
        const idUser = req.session.usuarioLogado.pk_id;

        // Limpeza básica do valor caso venha como string "R$ 1.000,00"
        let valorLimpo = Valor;
        if (typeof Valor === 'string') {
             valorLimpo = parseFloat(Valor.replace("R$", "").replace(/\./g, "").replace(",", ".").trim());
        }

        try {
            // Atualiza no Banco (Model)
            const resultado = await UserModel.saldo(valorLimpo, idUser);
            
            if (resultado.sucesso) {
                // Atualiza a Sessão para não precisar relogar
                req.session.usuarioLogado.Valor = valorLimpo;
                
                req.session.save(() => {
                    return res.json({ ok: true, novoValor: valorLimpo });
                });
            } else {
                return res.status(400).json({ ok: false, msg: "Erro ao atualizar" });
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ ok: false, msg: "Erro interno" });
        }
    },
    };


    
module.exports = UserController;