import * as React from 'react';
import '../styles/NavButton.css';

/**
 * NavButton is the large, pulsating 'Q' button at the top of the NavModal.
 */

const NavButton: React.SFC = () => {
    const handleNavModalOpen = () => {
        const nav = document.querySelector('#nav');
        if (nav) nav.classList.remove('hidden');
        const navButton = document.querySelector('#nav-button');
        if (navButton) navButton.classList.add('hidden');
    };

    return (
        <div id='nav-button' onClick={ handleNavModalOpen }>
            <span>Q</span>
        </div>
    )
}

export default NavButton;
