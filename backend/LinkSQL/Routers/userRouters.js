const express = require('express')

const router = express.Router();

const controllersUsers = require("../Controllers/userController");

router.post("/cadastro", controllersUsers.cadastrar);
router.post("/login", controllersUsers.login);
router.post("/recuperar", controllersUsers.recuperar);
router.post("/verificar", controllersUsers.verificar);

module.exports = router;
