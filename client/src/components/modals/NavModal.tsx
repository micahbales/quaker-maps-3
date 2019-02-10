import * as React from 'react';
import '../../styles/components/NavModal.css';
import {Meeting, SearchCriteria, Titles} from '../../Definitions';

interface NavModalProps {
    handleNavSubmit: (e: React.SyntheticEvent<Element>) => void;
    handleInputChange: (criterion: string, e: React.SyntheticEvent<Element>) => void;
    searchCriteria: SearchCriteria;
    meetings: Meeting[];
    yearlymeetings: Meeting[];
    branches: any;
    worshipStyles: any;
    accessibilities: any;
    titles: Titles;
}

class NavModal extends React.Component<NavModalProps> {

    public handleModalClose() {
       const nav = document.querySelector('#nav');
       if (nav) nav.classList.add('hidden');
       const navButton = document.querySelector('#nav-button');
       if (navButton) navButton.classList.remove('hidden');
    }

    public render() {
        return (
            <div id='nav' className='hidden'>
                <span className='close' onClick={this.handleModalClose}>
                    &times;
                </span>
                <div className='content'>
                    <h2>Filter Meetings</h2>
                </div>
                <form className='filter-meetings-form'>
                    <div className='form-element'>
                        <input type='text' className='zip' placeholder='Zip Code' 
                            value={this.props.searchCriteria.zip} 
                            onChange={this.props.handleInputChange.bind(this.props, 'zip')} />
                    </div>

                    <div className='form-element'>
                        <select className='state' 
                            value={this.props.searchCriteria.state}
                            onChange={this.props.handleInputChange.bind(this.props, 'state')}>
                            <option value=''>Meeting State</option>
                            {
                                this.props.titles.stateTitles.map((s: string, i) => {
                                    return (
                                        <option value={s} key={i}>{s}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className='form-element'>
                        <select className='yearlymeeting'
                            value={this.props.searchCriteria.yearly_meeting}
                            onChange={this.props.handleInputChange.bind(this.props, 'yearly_meeting')}>
                            <option value=''>Yearly Meeting</option>
                            {
                                this.props.titles.yearlyMeetingTitles.map((s: string, i) => {
                                    return (
                                        <option value={s} key={i}>{s}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className='form-element'>
                        <select className='accessibility'
                            value={this.props.searchCriteria.accessibility}
                            onChange={this.props.handleInputChange.bind(this.props, 'accessibility')}>
                            <option value=''>Accessibility Options</option>
                            {
                                this.props.titles.accessibilityTitles.map((s: string, i) => {
                                    return (
                                        <option value={s} key={i}>{s}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className='form-element'>
                        <select className='branch'
                            value={this.props.searchCriteria.branch}
                            onChange={this.props.handleInputChange.bind(this.props, 'branch')}>
                            <option value=''>Branch</option>
                            {
                                this.props.titles.branchTitles.map((s: string, i) => {
                                    return (
                                        <option value={s} key={i}>{s}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className='form-element'>
                        <select className='worship-style'
                            value={this.props.searchCriteria.worship_style}
                            onChange={this.props.handleInputChange.bind(this.props, 'worship_style')}>
                            <option value=''>Worship Style</option>
                            {
                                this.props.titles.worshipStyleTitles.map((s: string, i) => {
                                    return (
                                        <option value={s} key={i}>{s}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <div className='form-element'>
                        <input type='radio' name='lgbt' value='true' 
                            checked={this.props.searchCriteria.lgbt_affirming === 'true'}
                            onChange={this.props.handleInputChange.bind(this.props, 'lgbt_affirming')} />
                            LGBT-Affirming<br/>
                        <input type='radio' name='lgbt' value='false' 
                            checked={this.props.searchCriteria.lgbt_affirming === 'false'}
                            onChange={this.props.handleInputChange.bind(this.props, 'lgbt_affirming')} />
                            Non-Affirming<br/>
                        <input type='radio' name='lgbt' value='truefalse'
                            checked={this.props.searchCriteria.lgbt_affirming === 'truefalse' ||
                            !this.props.searchCriteria.lgbt_affirming}
                            onChange={this.props.handleInputChange.bind(this.props, 'lgbt_affirming')} />
                            All
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
