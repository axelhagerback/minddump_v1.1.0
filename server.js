const express = require('express');
const server = express();
const router = express.Router();
const fs = require('fs');
const bodyparser = require('body-parser');
const userController = require('./controllers/userController');
const dataController = require('./controllers/dataController');


server.use(express.static('public'));

server.use(express.json());

server.get('/', (req, res) => {
    fs.readFile('index.html','utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
}); 

server.get('/home', (req, res) => {

    fs.readFile('home.html', 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });

});

server.get('/myNotes', (req, res) => {

    fs.readFile('myNotes.html', 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });

});

server.post('/addUser', (req, res) => {

    var userLoginInfo = [];

    userLoginInfo = req.body;
  
    console.log(userLoginInfo);

});


server.listen(8080);
console.log('Server is running');

