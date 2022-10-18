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

myNotes = () => {

    const XHR = new XMLHttpRequest();

    XHR.onload = () => {

        const divContent = document.getElementById('app');
        divContent.innerHTML = XHR.responseText;

    }

    XHR.open('GET', '/myNotes');
    XHR.send();

}


/*buildNavbar = () => {

    const divNavbar = document.getElementById('navbar');

    const navbar = document.createElement('nav');
    navbar.className = 'navbar navbar-light bg-light';
    divNavbar.appendChild(navbar);

    const homeIcon = document.createElement('a');
    homeIcon.className = 'navbar-brand';
    navbar.appendChild(homeIcon);

}*/