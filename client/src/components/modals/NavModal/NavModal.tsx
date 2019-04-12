import { Button } from '@material-ui/core'
import * as React from 'react';
import './styles/NavModal.css';
import { Meeting, SearchCriteria, Titles } from '../../../Definitions';

/**
 * NavModal is a collapsible menu, visible on MainMapView.
 * This modal allows the user to select from various search criteria,
 * adjusting which meetings are displayed on the map.
 */

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

const NavModal: React.FC<NavModalProps> = ({
    handleNavSubmit,
    handleInputChange,
    searchCriteria,
    meetings,
    yearlymeetings,
    branches,
    worshipStyles,
    accessibilities,
    titles,
    ...props
}) => {

    const handleModalClose = () => {
       const nav = document.querySelector('#nav');
       if (nav) nav.classList.add('hidden');
       const navButton = document.querySelector('#nav-button');
       if (navButton) navButton.classList.remove('hidden');
    }


    return (
        <div id='nav' className='hidden'>
            <span className='close' onClick={handleModalClose}>
                &times;
            </span>
            <div className='content'>
                <h2>Filter Meetings</h2>
            </div>
            <form className='filter-meetings-form'>
                <div className='form-element'>
                    <input type='text' className='zip' placeholder='Zip Code' 
                        value={searchCriteria.zip} 
                        onChange={handleInputChange.bind(props, 'zip')} />
                </div>

                <div className='form-element'>
                    <select className='state' 
                        value={searchCriteria.state}
                        onChange={handleInputChange.bind(props, 'state')}>
                        <option value=''>Meeting State</option>
                        {
                            titles.stateTitles.map((s: string, i) => {
                                return (
                                    <option value={s} key={i}>{s}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className='form-element'>
                    <select className='yearlymeeting'
                        value={searchCriteria.yearly_meeting}
                        onChange={handleInputChange.bind(props, 'yearly_meeting')}>
                        <option value=''>Yearly Meeting</option>
                        {
                            titles.yearlyMeetingTitles.map((s: string, i) => {
                                return (
                                    <option value={s} key={i}>{s}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className='form-element'>
                    <select className='accessibility'
                        value={searchCriteria.accessibility}
                        onChange={handleInputChange.bind(props, 'accessibility')}>
                        <option value=''>Accessibility Options</option>
                        {
                            titles.accessibilityTitles.map((s: string, i) => {
                                return (
                                    <option value={s} key={i}>{s}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className='form-element'>
                    <select className='branch'
                        value={searchCriteria.branch}
                        onChange={handleInputChange.bind(props, 'branch')}>
                        <option value=''>Branch</option>
                        {
                            titles.branchTitles.map((s: string, i) => {
                                return (
                                    <option value={s} key={i}>{s}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className='form-element'>
                    <select className='worship-style'
                        value={searchCriteria.worship_style}
                        onChange={handleInputChange.bind(props, 'worship_style')}>
                        <option value=''>Worship Style</option>
                        {
                            titles.worshipStyleTitles.map((s: string, i) => {
                                return (
                                    <option value={s} key={i}>{s}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className='form-element'>
                    <input type='radio' name='lgbt' value='true' 
                        checked={searchCriteria.lgbt_affirming === 'true'}
                        onChange={handleInputChange.bind(props, 'lgbt_affirming')} />
                        LGBT-Affirming<br/>
                    <input type='radio' name='lgbt' value='false' 
                        checked={searchCriteria.lgbt_affirming === 'false'}
                        onChange={handleInputChange.bind(props, 'lgbt_affirming')} />
                        Non-Affirming<br/>
                    <input type='radio' name='lgbt' value='truefalse'
                        checked={searchCriteria.lgbt_affirming === 'truefalse' ||
                        !searchCriteria.lgbt_affirming}
                        onChange={handleInputChange.bind(props, 'lgbt_affirming')} />
                        All
                </div>

                <div className='form-element'>
                    <Button onClick={handleNavSubmit}>Submit</Button>
                </div>
            </form>
        </div>
    )
}

export default NavModal;
