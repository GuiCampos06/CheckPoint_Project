const db = require("../../conexao/conexao"); // Importa sua conexão

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
            if (dados.Senha.length < 6) {
                return { sucesso: false, mensagem: "A senha deve ter pelo menos 6 caracteres." };
            }

            const sql = `
                INSERT INTO users 
                (Nome, Nick, Senha, Nascimento, Cidade, Personalidade, Valor, Disponibilidade) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                dados.Nome, dados.Nick, dados.Senha, dados.Nascimento, 
                dados.Cidade, dados.Personalidade, dados.Valor, dados.Disponibilidade
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
    }
};

module.exports = UserModel;