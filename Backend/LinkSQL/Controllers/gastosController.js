const db = require("../../conexao/conexao");

// Função auxiliar para transformar a query do banco em Promessa (Async/Await)
// Isso evita o erro de "Headers Sent" e o "Callback Hell"
const executeQuery = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = {
    // 1. Criar novo gasto
    novoGasto: async (req, res) => {
        console.log("--- NOVO GASTO ---");

        try {
            if (!req.session.usuarioLogado) {
                return res.status(403).json({ ok: false, msg: "Usuário não logado." });
            }

            const idUsuario = req.session.usuarioLogado.pk_id;
            const { valor, categoria, descricao } = req.body;

            if (!valor) {
                return res.json({ ok: false, msg: "Valor inválido." });
            }

            const sql = `
                INSERT INTO gastos (fk_idUsuario, valorGasto, categoria, descricao, dataGasto) 
                VALUES (?, ?, ?, ?, NOW())
            `;

            // O await "espera" o banco responder antes de continuar
            const result = await executeQuery(sql, [idUsuario, valor, categoria, descricao]);

            console.log("✅ Gasto salvo ID:", result.insertId);
            return res.json({ ok: true, msg: "Gasto registrado!" });

        } catch (err) {
            console.error("❌ Erro ao salvar gasto:", err);
            // O return garante que a resposta só seja enviada uma vez
            return res.status(500).json({ ok: false, msg: "Erro no Banco de Dados." });
        }
    },

    // 2. Listar gastos + Totais + Gráficos
    listar: async (req, res) => {
        try {
            if (!req.session.usuarioLogado) {
                return res.status(403).json({ ok: false, msg: "Usuário não logado" });
            }

            const idUsuario = req.session.usuarioLogado.pk_id;
            const rendaUsuario = req.session.usuarioLogado.Valor || 0;

            // --- DEFINIÇÃO DAS QUERIES ---

            // 1. Lista (Histórico)
            const sqlLista = `
                SELECT pk_idDespesa, valorGasto, categoria, descricao, 
                DATE_FORMAT(dataGasto, '%d/%m/%Y') as dataFormatada 
                FROM gastos 
                WHERE fk_idUsuario = ? 
                ORDER BY dataGasto DESC LIMIT 20
            `;

            // 2. Total do Mês Atual
            const sqlTotal = `
                SELECT SUM(valorGasto) as total 
                FROM gastos 
                WHERE fk_idUsuario = ? 
                AND MONTH(dataGasto) = MONTH(CURRENT_DATE()) 
                AND YEAR(dataGasto) = YEAR(CURRENT_DATE())
            `;

            // 3. Gráfico de Linha (Evolução Histórica)
            const sqlGrafico = `
                SELECT 
                    MONTH(dataGasto) as mes, 
                    YEAR(dataGasto) as ano,
                    SUM(valorGasto) as total
                FROM gastos
                WHERE fk_idUsuario = ?
                GROUP BY YEAR(dataGasto), MONTH(dataGasto)
                ORDER BY YEAR(dataGasto) ASC, MONTH(dataGasto) ASC
                LIMIT 6
            `;

            // 4. Gráfico de Pizza (Categorias - Histórico Completo)
            const sqlPizza = `
                SELECT categoria, SUM(valorGasto) as total
                FROM gastos
                WHERE fk_idUsuario = ?
                GROUP BY categoria
            `;

            // --- EXECUÇÃO DAS QUERIES (LINEAR E SEGURA) ---
            
            // O await executa uma por uma. Se uma falhar, cai direto no catch.
            const resultsLista = await executeQuery(sqlLista, [idUsuario]);
            const resultsTotal = await executeQuery(sqlTotal, [idUsuario]);
            const resultsGrafico = await executeQuery(sqlGrafico, [idUsuario]);
            const resultsPizza = await executeQuery(sqlPizza, [idUsuario]);

            const totalGasto = resultsTotal[0].total || 0;

            // Resposta final única
            return res.json({
                ok: true,
                gastos: resultsLista,
                total: totalGasto,
                renda: rendaUsuario,
                dadosGrafico: resultsGrafico,
                dadosPizza: resultsPizza
            });

        } catch (err) {
            console.error("❌ Erro ao listar dados:", err);
            // Se já tiver enviado cabeçalho antes (muito difícil acontecer aqui), ele evita o crash
            if (!res.headersSent) {
                return res.status(500).json({ ok: false, msg: "Erro interno no servidor" });
            }
        }
    },
    
    deletar: async (req, res) => {
        try {
            if (!req.session.usuarioLogado) return res.status(403).json({ ok: false });
            
            const idUsuario = req.session.usuarioLogado.pk_id;
            const { idDespesa } = req.body; // Recebe o ID do gasto a apagar

            // Segurança: O WHERE garante que só apaga se o gasto for DO usuário logado
            const sql = "DELETE FROM gastos WHERE pk_idDespesa = ? AND fk_idUsuario = ?";
            
            await executeQuery(sql, [idDespesa, idUsuario]);

            res.json({ ok: true, msg: "Gasto removido!" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, msg: "Erro ao deletar" });
        }
    },

    // 4. Editar Gasto
    editar: async (req, res) => {
        try {
            if (!req.session.usuarioLogado) return res.status(403).json({ ok: false });

            const idUsuario = req.session.usuarioLogado.pk_id;
            const { idDespesa, valor, categoria, descricao } = req.body;

            const sql = `
                UPDATE gastos 
                SET valorGasto = ?, categoria = ?, descricao = ? 
                WHERE pk_idDespesa = ? AND fk_idUsuario = ?
            `;

            await executeQuery(sql, [valor, categoria, descricao, idDespesa, idUsuario]);

            res.json({ ok: true, msg: "Gasto atualizado!" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, msg: "Erro ao editar" });
        }
    }
};