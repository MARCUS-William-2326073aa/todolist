import React from "react";
import App from './App.js';

function Header({ onHome }) {

    function homeButton(){
        onHome();
    }

    return (
        <div className="App">
            <header className="App-header">
                <p>ouioui</p>
                <button onClick={homeButton} >home button</button>
            </header>
        </div>
    );
}

export default Header;