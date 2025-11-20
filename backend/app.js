const http = require("http")

const app = require("./conexao/server")






const port = app.get('port') || 4000

try {
    http.createServer(app).listen(port, () => {
        console.log(`\nServidor Rodando em http://localhost:${port}/`)
    });
} catch (error) {
    console.log("Ocorreu um ERRO ao inicializar o Servidor Web", error)
}