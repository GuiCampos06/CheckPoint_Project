const http = require("http")
const app = require("./conexao/server.js")
const path = require('path');


//pagina de erro
app.use((req, res) => {
    return res.status(404).sendFile(path.join(__dirname, '/public/erro404.html'));
})

//  crie e ativa o server
const port = app.get('port') || 4000
try {
    http.createServer(app).listen(port, () => {
        console.log(`\nServidor Rodando em http://localhost:${port}/`)
    });
} catch (error) {
    console.log("Ocorreu um ERRO ao inicializar o Servidor Web", error)
}