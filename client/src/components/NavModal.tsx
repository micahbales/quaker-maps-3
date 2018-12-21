import * as React from 'react';
import '../styles/NavModal.css';
import {NavModalProps} from '../Definitions';

class NavModal extends React.Component<NavModalProps> {

    public states = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI',
            'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI',
            'MN','MS','MO','MT','NE','NV','NH','NJ', 'NM', 'NY','NC','ND',
            'OH','OK','OR','PA','RI', 'SC','SD', 'TN','TX','UT','VT','VA','WA',
            'WV','WI','WY','AB','BC','NB','NL','NS', 'NT','NU','ON','PE', 'QC','SK','YT'];
    public yearlymeetings = ['Great Plains Yearly Meeting', 'EFC - Mid America Yearly Meeting'];
    public accessibilities = ['Wheelchair Accessible', 'Hearing Assistance System', 'Childcare Available'];
    public branches = ['Friends General Conference', 'Friends United Meeting',
            'Evangelical Friends Church International', 'Conservative',
            'Holiness', 'Independent'];
    public worshipStyles = ['Unprogrammed', 'Programmed', 'Semi-programmed'];

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
                        <input type='text' className='zip' placeholder='Zip Code' 
                            value={this.props.searchCriteria.zip} onChange={this.props.handleInputChange} />
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
                        <select className='yearlymeeting'>
                            <option value=''>Yearly Meeting</option>
                            {
                                this.yearlymeetings.map((s: string, i) => {
                                    return (
                                        <option value={s} key={i}>{s}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className='form-element'>
                        <select className='accessibility'>
                            <option value=''>Accessibility Options</option>
                            {
                                this.accessibilities.map((s: string, i) => {
                                    return (
                                        <option value={s} key={i}>{s}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className='form-element'>
                        <select className='branch'>
                            <option value=''>Branch</option>
                            {
                                this.branches.map((s: string, i) => {
                                    return (
                                        <option value={s} key={i}>{s}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className='form-element'>
                        <select className='worship-style'>
                            <option value=''>Worship Style</option>
                            {
                                this.worshipStyles.map((s: string, i) => {
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
