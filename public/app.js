login = () => {

    const XHR = new XMLHttpRequest(); 

    XHR.onload = () => {

        const divContent = document.getElementById('app');
        
        divContent.innerHTML = XHR.responseText;

    }

    XHR.open('GET', '/home');
    XHR.send();

};


createAccount = () => {

};