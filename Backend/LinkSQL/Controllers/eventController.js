const db = require("../../conexao/conexao");

module.exports = {
    criar(req, res) {
    const { nomeEvento, valorEvento, dataEvento, localEvento, QuantParticipantes } = req.body;
    const idUser = req.session.usuarioLogado.pk_id;
    let valorLimpo = String(valorEvento)
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
    const sqlEvento = `
        INSERT INTO events (fk_idUsuario, nomeEvento, dataEvento, localEvento, QuantParticipantes)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sqlEvento, [idUser, nomeEvento, dataEvento, localEvento, QuantParticipantes], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ ok: false, msg: "Erro ao criar evento." });
        }
        const idEvento = result.insertId;
        const sqlGasto = `
            INSERT INTO gastos (fk_idUsuario, valorGasto, categoria, fk_idEvento)
            VALUES (?, ?, 'eventos', ?)
        `;
        db.query(sqlGasto, [idUser, valorLimpo, idEvento], (err) => {
            if (err) {
                console.error(err);
                return res.json({ ok: false, msg: "Erro ao criar gasto." });
            }
            return res.json({ ok: true });
        });
    });
},
    quantidade(req, res) {    
        const idUser = req.session.usuarioLogado.pk_id;
        db.query("SELECT COUNT(*) AS total FROM events WHERE fk_idUsuario = ?", [idUser],(err, result) => {
            if (err) {
                console.error(err);
                return res.json({ ok: false });
            }
            res.json({ ok: true, total: result[0].total });
        });
    },

    listarEventos(req, res) {
        const idUser = req.session.usuarioLogado.pk_id;
        const sql = "SELECT pk_idEvento, nomeEvento FROM events WHERE fk_idUsuario = ?";

        db.query(sql,[idUser], (err, results) => {
            if (err) return res.status(500).json({ ok: false, erro: err });

            res.json({ ok: true, eventos: results });
        });
    },

    buscarEvento(req, res) {
    const idUser = req.session.usuarioLogado.pk_id;
    const id = req.params.id;

    const sqlEvento = `
        SELECT * FROM events WHERE pk_idEvento = ? AND fk_idUsuario = ?
    `;
    const sqlGasto = `
        SELECT valorGasto FROM gastos WHERE fk_idEvento = ? AND fk_idUsuario = ? AND categoria = 'eventos'
    `;
    db.query(sqlEvento, [id, idUser], (err, eventoResult) => {

        if (err) return res.status(500).json({ ok: false, erro: err });

        if (eventoResult.length === 0) {
            return res.status(404).json({ ok: false, msg: "Evento não encontrado" });
        }

        db.query(sqlGasto, [id, idUser], (err, gastoResult) => {

            if (err) return res.status(500).json({ ok: false, erro: err });

            return res.json({
                ok: true,
                evento: eventoResult[0],
                gasto: gastoResult[0] || { valorGasto: 0 }
            });
        });
    });
},

    apagarEvento(req, res) {
        const id = req.params.id;

        const sql = "DELETE FROM events WHERE pk_idEvento = ?";
        db.query(sql, [id], (err, results) => {
            if (err) return res.status(500).json({ ok: false, erro: err });

            if (results.length === 0) {
                return res.status(404).json({ ok: false, msg: "Evento não encontrado" });
            }

            res.json({ ok: true, evento: results[0] });
        });
    }
};