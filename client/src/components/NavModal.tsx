import * as React from 'react';
import '../styles/NavModal.css';
import {NavModalProps} from '../Definitions';

class NavModal extends React.Component<NavModalProps> {

    public states = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI',
            'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI',
            'MN','MS','MO','MT','NE','NV','NH','NJ', 'NM', 'NY','NC','ND',
            'OH','OK','OR','PA','RI', 'SC','SD', 'TN','TX','UT','VT','VA','WA',
            'WV','WI','WY','AB','BC','NB','NL','NS', 'NT','NU','ON','PE', 'QC','SK','YT'];

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
                        <input className='zip' placeholder='Zip Code' />
                    </div>

                    <div className='form-element'>
                        <select className='state'>
                            <option value=''>Meeting State</option>
                            {
                                this.states.map((s: string, i) => {
                                    return (
                                        <option value={s} key={i}>{s}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className='form-element'>
                        <input type='radio' name='lgbt' value='true' /> LGBT-Affirming<br/>
                        <input type='radio' name='lgbt' value='false' /> Non-Affirming<br/>
                        <input type='radio' name='lgbt' value='truefalse' /> All
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
