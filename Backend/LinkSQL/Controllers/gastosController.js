const GastosModel = require('../Models/gastosModel');

const GastosController = {
    novoGasto: async (req, res) => {
        const { idUsuario, valor, categoria } = req.body;

        // Validação simples
        if (!idUsuario || !valor) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: "ID do usuário e valor são obrigatórios." 
            });
        }

        try {
            const resultado = await GastosModel.adicionarGasto(idUsuario, parseFloat(valor), categoria);

            if (resultado.sucesso) {
                // Aqui devolvemos o statusFinanceiro (Verde/Vermelho) que veio do Model
                res.status(200).json(resultado);
            } else {
                res.status(400).json(resultado);
            }
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ sucesso: false, mensagem: "Erro ao processar gasto." });
        }
    }
};

module.exports = GastosController;