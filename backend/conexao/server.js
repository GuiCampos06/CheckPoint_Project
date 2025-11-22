const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// pasta public
app.use(express.static(path.join(__dirname, "../public")));

// Porta
app.set('port', 4000);

module.exports = app;
