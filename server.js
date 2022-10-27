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
var userLoginInfo;
var noteId;

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
    userLoginInfo = req.body;

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
  var createAccountInfo = req.body;

  baseUsers("users")
    .select({
      filterByFormula: `Email="${createAccountInfo.Email}"`,
    })
    .eachPage((records, processNextPage) => {
      if (records.length > 0) {
        res.send("Already exists");
        return;
      }
      bcrypt.hash(createAccountInfo.Password, 10, (err, hash) => {
        if (err) {
          console.error(err);
          return;
        }

        baseUsers("users").create(
          [
            {
              fields: {
                Email: createAccountInfo.Email,
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
  var { Email } = userLoginInfo;

  baseUsers("users")
    .select({
      filterByFormula: `Email="${Email}"`,
    })
    .eachPage((records, fetchNextPage) => {
      baseNotes("notes")
        .create([
          {
            fields: {
              UserId: records[0].get("RecordId"),
              Title: noteInfo.Title,
              Note: noteInfo.Post,
            },
          },
        ])
        .catch((err) => console.log(err));
      res.send("Success");
      return;
    });
});

server.get("/notes", (req, res) => {
  notesArray = [];
  var { Email } = userLoginInfo;
  var userId;

  baseUsers("users")
    .select({
      filterByFormula: `Email="${Email}"`,
    })
    .eachPage((records, fetchNextPage) => {
      userId = records[0].get("RecordId");
      baseNotes("notes")
        .select({
          filterByFormula: `UserId="${userId}"`,
        })
        .eachPage((noteRecords, fetchNextPage) => {
          noteRecords.forEach((record) => {
            var note = {
              UserId: record.get("UserId"),
              Title: record.get("Title"),
              Note: record.get("Note"),
              Date: record.get("Date"),
              RecordId: record.get("RecordId"),
            };
            notesArray.push(note);
          });
          res.send(notesArray);
        });
    });
});

server.post("/deleteNote", (req, res) => {
  var noteId = req.body;

  baseNotes("notes").destroy(noteId.NoteId),
    (err, deletedRecords) => {
      if (err) {
        res.send("Wrong");
        return;
      }
    };
  res.send("Success");
  return;
});

server.post("/editNote", (req, res) => {
    if (req.user) {
      noteId = {};
      noteInfo = req.body;
      noteId = noteInfo.NoteId;
      fs.readFile("edit.html", "utf-8", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      });
    } else {
      res.redirect('/');
      return;
    }
});

server.post("/saveEdit", (req, res) => {
  var noteInfo = req.body;
  var { Email } = userLoginInfo;
  var userId;

  baseUsers("users")
    .select({
      filterByFormula: `Email="${Email}"`,
    })
    .eachPage((records, fetchNextPage) => {
      userId = records[0].get("RecordId")
    });

    baseNotes("notes").update([
    {
      id: noteId,
      fields: {
        UserId: userId,
        Title: noteInfo.Title,
        Note: noteInfo.Post
      }
    }
  ])
  res.send("Success");
  return;
});

server.get("/logout", (req, res) => {
  res.redirect("/");
  req.logout(() => {});
});

server.listen(8080);
console.log("Server is running");
