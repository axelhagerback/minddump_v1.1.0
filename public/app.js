login = () => {
  var userInfo;

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  var infoOrder = {
    Email: email,
    Password: password,
    username: email,
    password: password,
  };
  userInfo = infoOrder;

  const XHR = new XMLHttpRequest();

  XHR.onload = () => {
    const divContent = document.getElementById("body");
    const response = XHR.responseText;

    if (email.length == 0 || password.length == 0) {
      const noInfo = document.createElement("p");
      noInfo.innerHTML = "No password or Email has been entered";
      Bttns.append(noInfo);
      return false;
    }
    if (response == "Wrong") {
      console.log(response);
    } else {
      divContent.innerHTML = response;
    }
  };

  XHR.open("POST", "/home");
  XHR.setRequestHeader("Content-type", "application/json");
  XHR.send(JSON.stringify(userInfo));

  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
};

dirHome = () => {
  const XHR = new XMLHttpRequest();

  XHR.onload = () => {
    const divContent = document.getElementById("body");
    divContent.innerHTML = XHR.responseText;
  };

  XHR.open("GET", "/home");
  XHR.send();
};

formCreateAccount = () => {
  createAccountBox.hidden = false;
};

createAccount = () => {
  var userInfo;

  var email = document.getElementById("userEmail").value;
  var password = document.getElementById("userPassword").value;

  var infoOrder = { Email: email, Password: password };
  userInfo = infoOrder;

  const XHR = new XMLHttpRequest();

  XHR.onload = () => {
    const response = XHR.responseText;
    if (response == "Already exists") {
      const createAccountDiv = document.getElementById("createAccountBox");
      if (createAccountDiv != null) {
        createAccountDiv.classList.add("shakeCSS");
        createAccountDiv.classList.toggle("shakeCSS");
        setTimeout(() => createAccountDiv.classList.toggle("shakeCSS"), 100);
        setTimeout(() => createAccountDiv.classList.toggle("shakeCSS"), 1500);
      }
    }
  };

  XHR.open("POST", "/addUser");
  XHR.setRequestHeader("Content-type", "application/json");
  XHR.send(JSON.stringify(userInfo));

  document.getElementById("userEmail").value = "";
  document.getElementById("userPassword").value = "";
};

create = () => {
  var title = document.getElementById("title").value;
  var post = document.getElementById("post").value;

  var noteInfo = { Title: title, Post: post };

  const XHR = new XMLHttpRequest();

  XHR.onload = () => {
    const response = XHR.responseText;
  };

  XHR.open("POST", "/createNote");
  XHR.setRequestHeader("Content-type", "application/json");
  XHR.send(JSON.stringify(noteInfo));

  document.getElementById("title").value = "";
  document.getElementById("post").value = "";
};

myNotes = () => {
  const XHR = new XMLHttpRequest();

  XHR.onload = () => {
    const divContent = document.getElementById("body");
    divContent.innerHTML = XHR.responseText;
    buildNotes();
  };

  XHR.open("GET", "/myNotes");
  XHR.send();
};

buildNotes = () => {
  const XHR = new XMLHttpRequest();

  //skapa variabel med responsetext

  const userNotes = document.getElementById("userNotes");
  //const indNote = document.getElementById('note');

  XHR.onload = () => {
    var Notes = JSON.parse(XHR.responseText);
    userNotes.innerHTML = "";

    Notes.forEach((note) => {
      var noteId = note.RecordId;
      var noteDiv = document.createElement("div");
      var noteHeader = document.createElement("div");
      var noteMain = document.createElement("div");
      var noteFooter = document.createElement("div");
      var editbtn = document.createElement("button");
      var delbtn = document.createElement("button");
      var btnDiv = document.createElement("div");

      noteDiv.setAttribute("class", "noteDiv");
      noteHeader.setAttribute("class", "noteHeader");
      noteMain.setAttribute("class", "userNote");
      noteFooter.setAttribute("class", "noteFooter");
      editbtn.setAttribute("class", "editbtn");
      delbtn.setAttribute("class", "delbtn");
      btnDiv.setAttribute("class", "btnDiv");

      editbtn.addEventListener("click", () => {
        editNote(noteId);
      });

      delbtn.addEventListener("click", () => {
        deleteNote(noteId);
      });

      noteHeader.innerText = `${note.Title}`;
      noteMain.innerText = `${note.Note}`;
      noteFooter.innerText = `${note.Date}`;
      editbtn.innerText = "Edit";
      delbtn.innerText = "Delete";

      noteDiv.append(noteHeader);
      noteDiv.append(noteMain);
      noteDiv.append(noteFooter);
      btnDiv.append(editbtn);
      userNotes.append(noteDiv);
      btnDiv.append(delbtn);
      noteFooter.append(btnDiv);
    });
  };

  XHR.open("GET", "/notes");
  XHR.send();
};

deleteNote = (noteId) => {
  var noteRecordId = { NoteId: noteId };

  const XHR = new XMLHttpRequest();

  XHR.onload = () => {
    const response = XHR.responseText;
    var userNotes = document.getElementById("userNotes");
    userNotes.innerText = "";
    if (response == "Success") {
      buildNotes();
    } else {
      console.log("Something went wrong");
    }
  };

  XHR.open("POST", "/deleteNote");
  XHR.setRequestHeader("Content-type", "application/json");
  XHR.send(JSON.stringify(noteRecordId));
};
editNote = (noteId) => {
  console.log("edited note with id " + noteId);
};

logout = () => {
  const XHR = new XMLHttpRequest();

  XHR.onload = () => {
    const divContent = document.getElementById("body");
    divContent.innerHTML = XHR.responseText;
  };

  XHR.open("GET", "/logout");
  XHR.send();
};

/*buildNavbar = () => {

    const divNavbar = document.getElementById('navbar');

    const navbar = document.createElement('nav');
    navbar.className = 'navbar navbar-light bg-light';
    divNavbar.appendChild(navbar);

    const homeIcon = document.createElement('a');
    homeIcon.className = 'navbar-brand';
    navbar.appendChild(homeIcon);

}*/
