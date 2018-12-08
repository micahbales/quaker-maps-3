import * as React from 'react';
import '../styles/NavModal.css';

class NavModal extends React.Component {

    public handleModalClose() {
       const nav = document.querySelector('#nav');
       if (nav) nav.classList.add('hidden');
    }

    public render() {
        return (
            <div id='nav'>
                <span className='close' onClick={this.handleModalClose}>
                    &times;
                </span>
                <div className='content'>
                    <h2>Filter Meetings</h2>
                </div>
            </div>
        )
    }
}

export default NavModal;
