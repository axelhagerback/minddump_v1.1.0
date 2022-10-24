const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const server = express();
const fs = require("fs");
require("dotenv").config();
const Airtable = require("airtable");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local");
const passport = require("passport");

const timer = 1000 * 60 * 30;

var notesArray = [];

var baseNotes = new Airtable({ apiKey: process.env.API_KEY }).base(
  "appe1p4d3ipTDbCef"
);
var baseUsers = new Airtable({ apiKey: process.env.API_KEY }).base(
  "app3AWTTb59zksQDR"
);

var strategy = new localStrategy((username, password, cb) => {
  baseUsers("users")
    .select({
      filterByFormula: `Email="${username}"`,
    })
    .eachPage((records, processNextPage) => {
      if (bcrypt.compareSync(password, records[0].get("Password"))) {
        console.log("Correct credentials");
      } else {
        return cb(null, false);
      }
      return cb(null, { id: records[0].id });
    });
});

passport.serializeUser((user, cb) => {
  return cb(null, {
    id: user.id,
  });
});

passport.deserializeUser((user, cb) => {
  return cb(null, {
    id: user.id,
  });
});

passport.use(strategy);
server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    cookie: { maxAge: timer },
    resave: false,
  })
);
server.use(passport.initialize());
server.use(passport.session());

server.get("/", (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  } else {
    fs.readFile("index.html", "utf-8", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  }
});

server.post(
  "/home",
  passport.authenticate("local", {
    failureRedirect: "/",
    failureMessage: true,
  }),
  (req, res) => {
    var userLoginInfo = req.body;

    baseUsers("users")
      .select({
        filterByFormula: `Email="${userLoginInfo.Email}"`,
      })
      .eachPage((records, processNextPage) => {
        bcrypt.compare(
          userLoginInfo.Password,
          records[0].get("Password"),
          (err, response) => {
            if (response) {
              fs.readFile("home.html", "utf-8", (err, data) => {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(data);
                res.end();
                return;
              });
            } else {
              res.send("Wrong");
              return;
            }
          }
        );
      })
      .catch((err) => console.log(err));
  }
);

server.get("/home", (req, res) => {
  if (req.user) {
    fs.readFile("home.html", "utf-8", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  } else {
    return res.redirect("/");
  }
});

server.get("/myNotes", (req, res) => {
  if (req.user) {
    fs.readFile("myNotes.html", "utf-8", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  } else {
    return res.redirect("/");
  }
});

server.post("/addUser", (req, res) => {
  var userLoginInfo = req.body;

  baseUsers("users")
    .select({
      filterByFormula: `Email="${userLoginInfo.Email}"`,
    })
    .eachPage((records, processNextPage) => {
      if (records.length > 0) {
        res.send("Already exists");
        return;
      }
      bcrypt.hash(userLoginInfo.Password, 10, (err, hash) => {
        if (err) {
          console.error(err);
          return;
        }

        baseUsers("users").create(
          [
            {
              fields: {
                Email: userLoginInfo.Email,
                Password: hash,
              },
            },
          ],
          function (err, records) {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      });
    })
    .catch((err) => console.log(err));
});

server.post("/createNote", (req, res) => {
  var noteInfo = req.body;

  res.send(noteInfo);
});

server.get("/notes", (req, res) => {
  notesArray = [];

  baseNotes("Notes")
    .select({
      view: "Grid view",
    })
    .firstPage((err, records) => {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach((record) => {
        var note = {
          UserId: record.get("UserId"),
          Title: record.get("Title"),
          Note: record.get("Note"),
          Date: record.get("Date"),
        };
        notesArray.push(note);
      });

      res.send(notesArray);
    });
});

server.listen(8080);
console.log("Server is running");
