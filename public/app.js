dirHome = () => {

    const XHR = new XMLHttpRequest(); 

    XHR.onload = () => {

        const divContent = document.getElementById('app');
        divContent.innerHTML = XHR.responseText;

    }

    XHR.open('GET', '/home');
    XHR.send();


};
 
formCreateAccount = () => {
    createAccountBox.hidden = false;
};

createAccount = () => {
    var userInfo = [];

    var email = document.getElementById('userEmail').value;
    var password = document.getElementById('userPassword').value;

    var infoOrder = {email: email, password: password};
    userInfo.push(infoOrder);

    createAccountBox.hidden = true;

    console.log(JSON.stringify(userInfo));


    const XHR = new XMLHttpRequest();

    XHR.open('POST', '/addUser');
    XHR.setRequestHeader('Content-type', 'application/json')
    XHR.send(JSON.stringify(userInfo));
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
    const indNote = document.getElementById('note');
    

    XHR.onload = () => {
       
        
        var Notes = JSON.parse(XHR.responseText);
        userNotes.innerHTML = '';

        Notes.forEach(note => {
            const textarea = document.createElement('textarea');
            textarea.setAttribute('class', 'userNote');
            textarea.innerHTML = (`Title: ${note.Title} || Note: ${note.Note} || Date: ${note.Date}`);
            userNotes.appendChild(textarea);
            textarea.appendChild(indNote);
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