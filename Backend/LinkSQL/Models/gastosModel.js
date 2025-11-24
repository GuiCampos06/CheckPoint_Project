const db = require("../../conexao/conexao");

const queryPromise = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

const GastosModel = {
    adicionarGasto: async (idUsuario, valor, categoria) => {
        try {
            if (valor <= 0) return { sucesso: false, mensagem: "Valor inválido." };

            const sql = "INSERT INTO gastos (fk_idUsuario, valorGasto, categoria) VALUES (?, ?, ?)";
            await queryPromise(sql, [idUsuario, valor, categoria]);

            // --- A MÁGICA DO TRIGGER ---
            // O banco já rodou o trigger. Agora buscamos o alerta mais recente.
            // CORREÇÃO: Ordernar por pk_idAlerta DESC (garante que pega o último inserido)
            // em vez de criado_em, para evitar bugs de mesmo segundo.
            const alertaSql = "SELECT * FROM alertas WHERE fk_idUsuario = ? ORDER BY pk_idAlerta DESC LIMIT 1";
            
            const alertas = await queryPromise(alertaSql, [idUsuario]);

            return { 
                sucesso: true, 
                mensagem: "Gasto registrado!", 
                // Se não tiver alerta ainda, assume Verde
                statusFinanceiro: alertas.length > 0 ? alertas[0].nivel : 'Verde'
            };

        } catch (error) {
            return { sucesso: false, erro: error.message };
        }
    }
};

module.exports = GastosModel;