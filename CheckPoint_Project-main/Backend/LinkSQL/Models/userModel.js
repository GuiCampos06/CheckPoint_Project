const db = require("../../conexao/conexao"); // Importa sua conexão
const bcrypt = require("bcrypt");//importa o bcrypt para criptografia

const queryPromise = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};



const UserModel = {
    criarUsuario: async (dados) => {
        try {
            // CORREÇÃO: Retorna false direto, sem throw Error, para não cair no catch
            if (dados.senha.length < 6) {
                return { sucesso: false, mensagem: "A senha deve ter pelo menos 6 caracteres." };
            }

            const senhaCriptografada = await bcrypt.hash(dados.senha, 10);

            const sql = `
                INSERT INTO users 
                (Nick, senha, email) 
                VALUES (?, ?, ?)
            `;
            
            const values = [
                dados.Nick, senhaCriptografada, dados.email
                
            ];

            const resultado = await queryPromise(sql, values);
            return { sucesso: true, id: resultado.insertId };

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return { sucesso: false, mensagem: "Este Nick já está em uso." };
            }
            console.error("Erro técnico:", error); // Loga o erro real no terminal para você ver
            return { sucesso: false, mensagem: "Erro interno ao salvar no banco." };
        }
    },

    // 2. Buscar Usuário por Nick (READ)
    buscarPorNick: async (nick) => {
        const sql = "SELECT * FROM users WHERE Nick = ?";
        const resultado = await queryPromise(sql, [nick]);
        return resultado[0]; // Retorna o primeiro (e único) usuário
    },

    validarLogin: async (u_nick, u_senha) => {

    const sql = "SELECT * FROM users WHERE Nick = ?";

    try {
        const result = await queryPromise(sql, [u_nick]);
        
        if (result.length === 0) {
            return { 
                sucesso: false,
                mensagem: "Usuário incorreto!",
            };
        } 
        const usuario = result[0];

        const senhaOk = await bcrypt.compare(u_senha, usuario.senha);
        if (!senhaOk){
            return {
                sucesso: false, 
                mensagem: "Senha incorretos." 
            };
        }
        return {
                sucesso: true,
                mensagem: "Login efetuado com sucesso!",
                usuario: usuario
            };

    } catch (erro) {
        console.error("Erro no banco:", erro);
        return {
            sucesso: false,
            mensagem: "Erro interno ao consultar o banco de dados."
        };
    }
    },
    recuperar: async (u_nick, u_email) => {

    const sql1 = "SELECT * FROM users WHERE Nick = ? AND email = ?";
    const sql2 = "UPDATE users SET codigo = ? WHERE Nick = ?";

    try {
        const result = await queryPromise(sql1, [u_nick, u_email]);
        if (result.length === 0) {
            return { 
                sucesso: false,
                mensagem: "Usuário ou email incorreto!",
            };
        } 
        const codigo = Math.floor(100000 + Math.random() * 900000); 

        await queryPromise(sql2, [codigo, u_nick]);
        return {
            sucesso: true,
            mensagem: "Código gerado.",
            codigo
        };
    }catch (erro) {
        console.error("Erro no banco:", erro);
        return {
            sucesso: false,
            mensagem: "Erro interno ao consultar o banco de dados."
        };
    }


    },
    verificar: async (codigo) =>{c
        
        const sql = "SELECT * FROM users WHERE codigo = ?"

        try {
            const result = await queryPromise(sql, [codigo]);
            if (result.length === 0) {
            return { 
                sucesso: false,
                mensagem: "codigo incorreto!",
            };
            
        } return{
                sucesso: true,
                mensagem: "Código Correto.",
            }
            
        }catch (erro) {
        console.error("Erro no banco:", erro);
        return {
            sucesso: false,
            mensagem: "Erro interno ao consultar o banco de dados."
        };
    }
    },
    editar_perfil: async (dados, idUser) => {
        try {
            
            const senhaCriptografada = await bcrypt.hash(dados.senha, 10);

            const sql = `
                UPDATE users SET Nick = ?, Nome = ?, Idade = ?, Valor = ?, email = ?, senha = ? WHERE pk_id = ?; 
            `;
            
            const values = [
                dados.Nick, dados.Nome, dados.Idade, dados.Valor, dados.email, senhaCriptografada, idUser
                
            ];

            const resultado = await queryPromise(sql, values);
            return { sucesso: true, id: resultado.insertId };

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return { sucesso: false, mensagem: "Este Nick já está em uso." };
            }
            console.error("Erro técnico:", error); // Loga o erro real no terminal para você ver
            return { sucesso: false, mensagem: "Erro interno ao salvar no banco." };
        }
    },
     saldo: async (dados, idUser) => {
        try {

            const sql = `
                UPDATE users SET Valor = ? WHERE pk_id = ?; 
            `;
            
            const values = [
                dados, idUser
            ];

            const resultado = await queryPromise(sql, values);
            return { sucesso: true, id: resultado.insertId };

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return { sucesso: false, mensagem: "Erro" };
            }
            console.error("Erro técnico:", error); // Loga o erro real no terminal para você ver
            return { sucesso: false, mensagem: "Erro interno ao salvar no banco." };
        }
    }
}

module.exports = UserModel;