login = () => {
    var userInfo;

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    var infoOrder = {Email: email, Password: password};
    userInfo = infoOrder;

    const XHR = new XMLHttpRequest(); 

    XHR.onload = () => {

        const divContent = document.getElementById('app');
        const response = XHR.responseText;
        
        if (response == 'Wrong') {
            console.log(response);
        } else {
            divContent.innerHTML = response;
        };
    };

    XHR.open('POST', '/home');
    XHR.setRequestHeader('Content-type', 'application/json')
    XHR.send(JSON.stringify(userInfo));

    document.getElementById('email').value = '';
    document.getElementById('password').value = '';

};

dirHome = () => {
    const XHR = new XMLHttpRequest();

    XHR.onload = () => {
        const divContent = document.getElementById('app');
        divContent.innerHTML = XHR.responseText;
    };

    XHR.open('GET', '/home');
    XHR.send();
};
 
formCreateAccount = () => {
    createAccountBox.hidden = false;
};

createAccount = () => {
    var userInfo;

    var email = document.getElementById('userEmail').value;
    var password = document.getElementById('userPassword').value;

    var infoOrder = {Email: email, Password: password};
    userInfo = infoOrder;


    const XHR = new XMLHttpRequest();

    XHR.onload = () => {
        const response = XHR.responseText;
        console.log(response);
        if (response == 'Already exists') {
            const createAccountDiv = document.getElementById('createAccountBox');
            if (createAccountDiv != null) {
                createAccountDiv.classList.add('shakeCSS');
                createAccountDiv.classList.toggle('shakeCSS');
                setTimeout(() => (createAccountDiv.classList.toggle('shakeCSS')), 100)
                setTimeout(() => (createAccountDiv.classList.toggle('shakeCSS')), 1500)            }
            };
    };

    XHR.open('POST', '/addUser');
    XHR.setRequestHeader('Content-type', 'application/json')
    XHR.send(JSON.stringify(userInfo));

    document.getElementById('userEmail').value = '';
    document.getElementById('userPassword').value = '';
};

create = () => {
    console.log('create note works')

    /*const XHR = new XMLHttpRequest();

    XHR.onload = () => {

    }

    XHR.open('POST', '/createNote');
    XHR.send();*/
};




myNotes = () => {

    const XHR = new XMLHttpRequest();

    XHR.onload = () => {

        const divContent = document.getElementById('app');
        divContent.innerHTML = XHR.responseText;
        buildNotes();
    }

    XHR.open('GET', '/myNotes');
    XHR.send();

};

buildNotes = () => {
    const XHR = new XMLHttpRequest();


    //skapa variabel med responsetext
    
    const userNotes = document.getElementById('userNotes');
    //const indNote = document.getElementById('note');
    

    XHR.onload = () => {
       
        
        var Notes = JSON.parse(XHR.responseText);
        userNotes.innerHTML = '';

        Notes.forEach(note => {
            const noteDiv = document.createElement('div');
            const noteHeader = document.createElement('div');
            const noteMain = document.createElement('div');
            const noteFooter = document.createElement('div');
            const editbtn = document.createElement('button');
            const delbtn = document.createElement('button');


            noteDiv.setAttribute('class', 'noteDiv');
            noteHeader.setAttribute('class', 'noteHeader');
            noteMain.setAttribute('class', 'userNote');
            noteFooter.setAttribute('class', 'noteFooter');
            editbtn.setAttribute('class', 'editbtn');
            delbtn.setAttribute('class', 'delbtn');

            noteHeader.innerHTML = `${note.Title}`;
            noteMain.innerHTML = `${note.Note}`;
            noteFooter.innerHTML = `${note.Date}`;
            editbtn.innerHTML = 'Edit';
            delbtn.innerHTML = 'Delete';

            noteDiv.append(noteHeader);
            noteDiv.append(noteMain);
            noteDiv.append(noteFooter);
            noteFooter.append(editbtn);
            userNotes.append(noteDiv);
            noteFooter.append(delbtn);
        });
        
    };

    
    XHR.open('GET', '/notes');
    XHR.send();
};


logout = () => {
    const XHR = new XMLHttpRequest();

    XHR.onload = () => {

        const divContent = document.getElementById('app');
        divContent.innerHTML = XHR.responseText;

    }

    XHR.open('GET', '/');
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