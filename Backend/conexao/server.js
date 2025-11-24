const express = require('express');
const path = require('path');
const session = require('express-session');

const UserController = require('../LinkSQL/Controllers/userController'); 
const EventController = require('../LinkSQL/Controllers/eventController');

function protegerRota(req, res, next) {
    if (!req.session.usuarioLogado) {
        return res.status(403).json({ ok: false, msg: "Usuário não está logado" });
    }
    next();
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// pasta public
app.use(session({
    secret: 'chave-secreta-do-checkpoint',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(express.static(path.join(__dirname, "../public")));
app.post('/users/cadastro', UserController.cadastrar);

//Rota Roles
app.post("/events/criar", EventController.criar);
app.get("/events/quantidade", protegerRota, EventController.quantidade);
app.get("/events", EventController.listarEventos);
app.get("/events/:id", EventController.buscarEvento);

// Quando o HTML mandar para action="/users/login"
app.post('/users/login', UserController.login);

// Quando o HTML mandar para action="/users/recuperar"
app.post('/users/recuperar', UserController.recuperar);

// Quando o HTML mandar para action="/users/verificar"
app.post('/users/verificar', UserController.verificar);

app.post('/users/editar_perfil', UserController.editar_perfil);

app.post('/users/cadastro', UserController.cadastrar);
app.post('/users/saldo',protegerRota, UserController.saldo);


app.get('/users/sessao', (req, res) => {
    if (req.session.usuarioLogado) {
        res.json({ logado: true, usuario: req.session.usuarioLogado });
    } else {
        res.json({ logado: false });
    }
});


// Rota de Logout (Sair)
app.get('/users/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/index.html');
});



// Porta
app.set('port', 4000);

module.exports = app;