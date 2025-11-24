
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const UserController = require('../LinkSQL/Controllers/userController'); 
const EventController = require('../LinkSQL/Controllers/eventController');
const GastosController = require('../LinkSQL/Controllers/gastosController');

function protegerRota(req, res, next) {
    if (!req.session.usuarioLogado) {
        return res.status(403).json({ ok: false, msg: "Usuário não está logado" });
    }
    next();
}


app.use(session({
    secret: 'chave-secreta-do-checkpoint',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(express.static(path.join(__dirname, "../public")));

// --- ROTAS DE USUÁRIOS ---
app.post('/users/cadastro', UserController.cadastrar);
app.post('/users/login', UserController.login);
app.post('/users/recuperar', UserController.recuperar);
app.post('/users/verificar', UserController.verificar);
app.post('/users/editar_perfil', protegerRota, UserController.editar_perfil); // Protegido
app.post('/users/saldo', protegerRota, UserController.saldo);
app.get('/users/sessao', (req, res) => {
    if (req.session.usuarioLogado) {
        res.json({ logado: true, usuario: req.session.usuarioLogado });
    } else {
        res.json({ logado: false });
    }
});
app.get('/users/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/index.html');
});

// --- ROTAS DE EVENTOS ---
app.post("/events/criar", protegerRota, EventController.criar);
app.post("/events/excluir", protegerRota, EventController.excluir); // <--- IMPORTANTE
app.get("/events", protegerRota, EventController.listarEventos);
app.get("/events/quantidade", protegerRota, EventController.quantidade);
app.get("/events/:id", protegerRota, EventController.buscarEvento);

// --- ROTAS DE GASTOS (CORRIGIDO) ---
app.post('/gastos/novo', protegerRota, GastosController.novoGasto); // Rota para salvar
app.get('/gastos/listar', protegerRota, GastosController.listar);   // Rota para listar
app.post('/gastos/deletar', protegerRota, GastosController.deletar);
app.post('/gastos/editar', protegerRota, GastosController.editar);

// Porta
app.set('port', 4000);

module.exports = app;