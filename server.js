const express = require('express');
const server = express();
const router = express.Router();
const fs = require('fs');

const userController = require('./controllers/userController');
const dataController = require('./controllers/dataController');


const Airtable = require('airtable');

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


var baseNotes = new Airtable({apiKey: 'keyqkD60p503sH4SW'}).base('appe1p4d3ipTDbCef');

//skapa global array
//skapa objekt för varje note med all information
//send array
var notesArray = [];


server.get('/notes', (req, res) => {

    baseNotes('Notes').select({
        view: 'Grid view'
    }).firstPage((err, records) => {
        if (err) { console.error(err); return; }
            records.forEach((record) => {

            var note = {UserId: record.get('UserId'), Title: record.get('Title'), Note: record.get('Note'), Date: record.get('Date')};
            notesArray.push(note);
        });

        res.send(notesArray);
    });
});



server.listen(8080);
console.log('Server is running');

