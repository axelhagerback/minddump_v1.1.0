const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require ('express-session');
const server = express();
const fs = require('fs');
require('dotenv').config()
const Airtable = require('airtable');
const bcrypt = require('bcrypt');
const session = require('express-session');

const timer = 1000 * 60 * 30;


server.use(sessions({
    secret: process.env.SECRET,
    saveUninitialized:true,
    cookie: {maxAge: timer},
    resave: false
}));

server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.use(express.static(__dirname));

server.use(cookieParser());

server.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        
    }
})

var notesArray = [];

var baseNotes = new Airtable({apiKey: process.env.API_KEY}).base('appe1p4d3ipTDbCef');
var baseUsers = new Airtable({apiKey: process.env.API_KEY}).base('app3AWTTb59zksQDR');


server.use(express.static('public'));


server.get('/', (req, res) => {
    fs.readFile('index.html','utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
}); 

server.post('/home', (req, res) => {

    var userLoginInfo = req.body;

    baseUsers('users').select({
      
        filterByFormula: `Email="${userLoginInfo.Email}"`
        
    }).eachPage((records, processNextPage) => {
            bcrypt.compare(userLoginInfo.Password, records[0].get('Password'), (err, response) => {
                if (response) {
                    fs.readFile('home.html', 'utf-8', (err, data) => {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(data);
                        res.end();
                        return;
                    });
                } else {
                res.send('Wrong');
                return;
            };
        });
    }).catch((err) => console.log(err));

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
   
    baseUsers('users').select({
        filterByFormula: `Email="${userLoginInfo.Email}"`
    }).eachPage((records, processNextPage) => {
        if (records.length > 0) {
            res.send('Already exists');
            return;
        }
        bcrypt.hash(userLoginInfo.Password, 10, (err, hash) => {
            if (err) {
                console.error(err);
                return;
            };
    
            baseUsers('users').create([
    
                {
                    "fields" : {
                        "Email": userLoginInfo.Email,
                        "Password": hash
                    }
                }
        
            ], function(err, records) {
                if (err) {
                    console.error(err);
                    return;
                };
            });
            
        });
    }).catch((err) => console.log(err));
          
});

server.post('/createNote', (req, res) => {
    var noteInfo = req.body;
    
    res.send(noteInfo);
});


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