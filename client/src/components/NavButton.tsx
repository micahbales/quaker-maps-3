import * as React from 'react';
import '../styles/NavButton.css';

class NavButton extends React.Component {
    public handleNavModalOpen() {
        const nav = document.querySelector('#nav');
        if (nav) nav.classList.remove('hidden');
        const navButton = document.querySelector('#nav-button');
        if (navButton) navButton.classList.add('hidden');
    }

    public render() {
        return (
            <div id='nav-button' onClick={this.handleNavModalOpen}>
                <span>Q</span>
            </div>
        );
    }
}

export default NavButton;
