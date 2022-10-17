const express = require('express');
const server = express();
const fs = require('fs');
const bodyparser = require('body-parser');

server.use(express.static('public'));

server.use(bodyparser.urlencoded({extended: true}));

server.get('/', (req, res) => {
    fs.readFile('public/index.html', (err, data) => {
        res.writeHead(200, ('Content-Type', 'text/html'));
        res.write(data);
        res.end();
    });
});


server.listen(8080);
console.log('Server is running');

