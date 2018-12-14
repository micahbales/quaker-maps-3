import * as React from 'react';
import '../styles/NavModal.css';
import {NavModalProps} from '../Definitions';

class NavModal extends React.Component<NavModalProps> {

    public handleModalClose() {
       const nav = document.querySelector('#nav');
       if (nav) nav.classList.add('hidden');

       document.querySelectorAll('.filter-meetings-form input')
            .forEach((input: HTMLInputElement) => input.value = '');
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
                <form className='filter-meetings-form'>
                    <div className='form-element'>
                        <input className='zip' type='number' placeholder='Zip Code' />
                    </div>
                    <div className='form-element'>
                        <button className='submit' type='submit' value='Find Meetings' 
                            onClick={this.props.handleNavSubmit}>Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default NavModal;
