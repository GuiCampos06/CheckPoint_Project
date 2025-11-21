const express = require('express')
const path = require('path');

const app = express()


app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.use(express.static(path.join(__dirname, 'public'))); //pasta public
app.use(express.static('style'));
app.use(express.static('js'));
app.use(express.static('img'));

app.set("views", path.join(__dirname, '../app/views'));    
app.set("view engine", "ejs");


app.set('view engine', 'ejs');
app.set('port', 5000);
module.exports = app;