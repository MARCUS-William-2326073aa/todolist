import React from "react";
import App from './App.js';
import logo from './logo.jpeg';

function Footer({ }) {
    let oui = 0;
    let tkt = 0;
    function Button() {
        oui = (oui === 0) ? 1 : 0;
        if (tkt === 0) { ouioui(); tkt = 1; }
    }

    function ouioui() {
        setInterval(() => {
            if (oui === 1) {
                const randomColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
                document.documentElement.style.setProperty('--main-bg-color', randomColor);
            }
        }, 10);
    }


    return (
        <div className="App">
            <footer className="App-footer">
                <button onClick={Button} src={logo} className="ouiouibaguette"><img  src={logo} className="App-logo" alt="logo" onClick={Button} /></button>

            </footer>
        </div>
    );
}

export default Footer;