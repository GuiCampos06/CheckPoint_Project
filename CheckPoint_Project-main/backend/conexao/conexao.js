const mysql = require("mysql2");
const database = "Checkpoint";

// Função que cria e mantém a conexão
function createConnection() {
  const conexao = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    port: 3306
  });

  conexao.connect((err) => {
    if (err) {
      console.error("❌ Erro ao conectar ao MySQL:", err);
      // tenta novamente após 2 segundos
      setTimeout(createConnection, 2000);
    } else {
      conexao.query("USE " + database);
      console.log("✅ Conexão com MySQL estabelecida com sucesso!");
    }
  });

  // Detecta quando a conexão cai e reconecta automaticamente
  conexao.on("error", (err) => {
    console.error("⚠️ Erro na conexão MySQL:", err.code);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
      console.log("🔁 Reconectando ao MySQL...");
      createConnection();
    } else {
      throw err;
    }
  });

  global.conexao = conexao; // torna acessível globalmente
}

createConnection();

module.exports = {
  query: (...args) => global.conexao.query(...args),
};
