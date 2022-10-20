const express = require('express');
const server = express();
const router = express.Router();
const fs = require('fs');
require('dotenv').config()
const Airtable = require('airtable');


var baseNotes = new Airtable({apiKey: process.env.API_KEY}).base('appe1p4d3ipTDbCef');
var baseUsers = new Airtable({apiKey: process.env.API_KEY}).base('app3AWTTb59zksQDR');


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

    var userLoginInfo = req.body;
    //console.log(process.env.API_KEY);

    baseUsers('users').create([

        {
            "fields" : {
                "Email": userLoginInfo.Email,
                "Password": userLoginInfo.Password
            }
        }

    ], function(err, records) {
        if (err) {
            console.error(err);
            return;
        }
        records.forEach(function (record) {
            console.log(record.getId());
        })
    })

});


//skapa global array
//skapa objekt för varje note med all information
//send array
var notesArray = [];


server.get('/notes', (req, res) => {
    notesArray = [];

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

