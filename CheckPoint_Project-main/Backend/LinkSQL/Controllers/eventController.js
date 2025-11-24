const db = require("../../conexao/conexao");

// Função auxiliar para Promessas (igual fizemos no Gastos)
const executeQuery = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

module.exports = {
    // 1. Criar Evento + Gasto Inicial
    criar: async (req, res) => {
        try {
            if (!req.session.usuarioLogado) return res.status(403).json({ ok: false });

            const idUser = req.session.usuarioLogado.pk_id;
            const { nomeEvento, valorEvento, dataEvento, localEvento, QuantParticipantes } = req.body;

            // Limpa o valor (R$ 1.000,00 -> 1000.00)
            let valorLimpo = String(valorEvento)
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim();

            const sqlEvento = `
                INSERT INTO events (fk_idUsuario, nomeEvento, dataEvento, localEvento, QuantParticipantes)
                VALUES (?, ?, ?, ?, ?)
            `;
            const resultEvento = await executeQuery(sqlEvento, [idUser, nomeEvento, dataEvento, localEvento, QuantParticipantes]);
            const idEvento = resultEvento.insertId;

            // Cria automaticamente o gasto associado ao evento
            const sqlGasto = `
                INSERT INTO gastos (fk_idUsuario, valorGasto, categoria, fk_idEvento, descricao, dataGasto)
                VALUES (?, ?, 'eventos', ?, ?, NOW())
            `;
            // Usa o nome do evento como descrição do gasto
            await executeQuery(sqlGasto, [idUser, valorLimpo, idEvento, `Rolê: ${nomeEvento}`]);

            res.json({ ok: true, msg: "Rolê criado com sucesso!" });

        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, msg: "Erro ao criar evento." });
        }
    },

    // 2. Quantidade de Rolês (para o card do Menu Inicial)
    quantidade: async (req, res) => {
        try {
            if (!req.session.usuarioLogado) return res.status(403).json({ ok: false });
            
            const idUser = req.session.usuarioLogado.pk_id;
            
            // O count(*) pega o total de linhas na tabela events para esse usuário
            const result = await executeQuery("SELECT COUNT(*) AS total FROM events WHERE fk_idUsuario = ?", [idUser]);
            
            // Retorna o total
            res.json({ ok: true, total: result[0].total });

        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, total: 0 });
        }
    },

    // 3. Listar Eventos (Apenas nomes e IDs para a lista principal)
    listarEventos: async (req, res) => {
        try {
            if (!req.session.usuarioLogado) return res.status(403).json({ ok: false });
            const idUser = req.session.usuarioLogado.pk_id;

            const sql = "SELECT pk_idEvento, nomeEvento FROM events WHERE fk_idUsuario = ? ORDER BY dataEvento DESC";
            const results = await executeQuery(sql, [idUser]);

            res.json({ ok: true, eventos: results });

        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, msg: "Erro ao listar" });
        }
    },

    // 4. Buscar Detalhes de um Evento (Quando clica no card)
    buscarEvento: async (req, res) => {
        try {
            if (!req.session.usuarioLogado) return res.status(403).json({ ok: false });
            const idUser = req.session.usuarioLogado.pk_id;
            const idEvento = req.params.id;

            const sqlEvento = "SELECT * FROM events WHERE pk_idEvento = ? AND fk_idUsuario = ?";
            const eventoResult = await executeQuery(sqlEvento, [idEvento, idUser]);

            if (eventoResult.length === 0) {
                return res.status(404).json({ ok: false, msg: "Evento não encontrado" });
            }

            // Busca o gasto associado
            const sqlGasto = "SELECT valorGasto FROM gastos WHERE fk_idEvento = ? AND fk_idUsuario = ?";
            const gastoResult = await executeQuery(sqlGasto, [idEvento, idUser]);

            res.json({
                ok: true,
                evento: eventoResult[0],
                gasto: gastoResult[0] || { valorGasto: 0 }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, msg: "Erro ao buscar detalhes" });
        }
    },

    // 5. Excluir Evento
    excluir: async (req, res) => {
        try {
            if (!req.session.usuarioLogado) return res.status(403).json({ ok: false });
            const idUser = req.session.usuarioLogado.pk_id;
            const { id } = req.body;

            // Ao apagar o evento, o banco (ON DELETE CASCADE) já deve apagar o gasto associado se configurado corretamente
            await executeQuery("DELETE FROM events WHERE pk_idEvento = ? AND fk_idUsuario = ?", [id, idUser]);

            res.json({ ok: true, msg: "Rolê cancelado!" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, msg: "Erro ao excluir" });
        }
    }
};