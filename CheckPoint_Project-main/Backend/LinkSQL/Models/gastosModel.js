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
    adicionarGasto: async (idUsuario, valor, categoria, descricao) => {
        try {
            if (valor <= 0) return { sucesso: false, mensagem: "Valor inválido." };

            const sql = "INSERT INTO gastos (fk_idUsuario, valorGasto, categoria, descricao) VALUES (?, ?, ?, ?)";
            await queryPromise(sql, [idUsuario, valor, categoria, descricao]);

            // Lógica de alerta movida para o backend para evitar erro de Mutating Table em Triggers
            // Aqui você pode implementar a verificação do limite se quiser retornar o status
            return { sucesso: true, mensagem: "Gasto registrado com sucesso!" };

        } catch (error) {
            console.error(error);
            return { sucesso: false, erro: error.message };
        }
    },

    listarPorUsuario: async (idUsuario) => {
        try {
            // Lista os últimos 50 gastos (para não pesar a página)
            const sql = `
                SELECT pk_idDespesa, valorGasto, categoria, descricao,
                    DATE_FORMAT(dataGasto, '%d/%m/%Y') as dataFormatada 
                FROM gastos 
                WHERE fk_idUsuario = ? 
                ORDER BY dataGasto DESC, pk_idDespesa DESC
                LIMIT 50
            `;
            
            const resultados = await queryPromise(sql, [idUsuario]);
            return { sucesso: true, gastos: resultados };
        } catch (error) {
            console.error(error);
            return { sucesso: false, erro: error.message };
        }
    },

    obterTotalMes: async (idUsuario) => {
        try {
            // CORREÇÃO CRÍTICA: Filtra pelo Mês e Ano atuais
            const sql = `
                SELECT SUM(valorGasto) as total 
                FROM gastos 
                WHERE fk_idUsuario = ? 
                AND MONTH(dataGasto) = MONTH(CURRENT_DATE()) 
                AND YEAR(dataGasto) = YEAR(CURRENT_DATE())
            `;
            const resultado = await queryPromise(sql, [idUsuario]);
            return { sucesso: true, total: resultado[0].total || 0 };
        } catch (error) {
            return { sucesso: false, total: 0 };
        }
    }
};

module.exports = GastosModel;