import * as React from 'react';
import '../../styles/components/ModifyMeetingModal.css';
import { Meeting, State, Titles } from '../../Definitions';
import { getMultiSelectValues } from '../../utils/helpers';
import { deleteMeeting, updateMeeting } from '../../api/api';
import { convertStringBooleans, states } from '../../utils/helpers'

/**
 * ModifyMeetingModal is a view where the user can update or delete a meeting.
 */

interface ModifyMeetingModalProps {
    history: any;
    meeting: Meeting;
    yearlymeetings: Meeting[];
    branches: any;
    worshipStyles: any;
    accessibilities: any;
    titles: Titles;
}

class ModifyMeetingModal extends React.Component<ModifyMeetingModalProps> {
    meeting: Meeting;
    state: any;

    constructor(props: ModifyMeetingModalProps) {
        super(props);
        this.state = {
            meeting: this.props.meeting,
            titles: this.props.titles,
            yearly_meeting: this.props.yearlymeetings,
            branch: this.props.branches,
            accessibility: this.props.accessibilities,
            worship_style: this.props.worshipStyles,
            selectedTitles: {
                yearlyMeetingTitles: this.props.meeting.yearly_meeting.map((ym) => ym.title),
                accessibilityTitles: this.props.meeting.accessibility.map((a) => a.title),
                worshipStyleTitles: this.props.meeting.worship_style.map((ws) => ws.title),
                branchTitles: this.props.meeting.branch.map((b) => b.title)
            },
        };
    }

    handleModalClose = () => {
        const modal = document.querySelector('#modify-meeting');
        if (modal) modal.classList.add('hidden');
    }

    handleUpdateMeeting = (e: React.SyntheticEvent) => {
        updateMeeting(this.state.meeting);
    }

    handleDeleteMeeting = () => {
        deleteMeeting(this.state.meeting)
            .then(() => {
                this.props.history.push('/');
                this.props.history.go();
            });
    }

    handleMultiSelectFormChange = (e: any) => {
        // Retrieve titles from selected options
        const field: string = e.target.className;
        const newTitles: string[] = getMultiSelectValues(e.target);

        // Assign updated group of entities (yms, branches, etc.) to this.state.meeting
        const state = {...this.state};
        const allPossibleEntities: any[] = this.state[field];
        state.meeting[field] = allPossibleEntities.filter((ent) => newTitles.includes(ent.title));
        this.setState(state);
    }

    handleUpdateAttr = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newAttrKey = e.target.name;
        const newAttrValue = convertStringBooleans(e.target.value);
        const meeting = { ...this.state.meeting }
        
        meeting[newAttrKey] = newAttrValue;
        this.setState({ meeting });
    };

    render = () => (
        <div id='modify-meeting' className='hidden'>
            <div className='content'>
                <span className='close' onClick={this.handleModalClose}>
                    &times;
                </span>
                
                <h1>{this.state.meeting.title}</h1>

                <form>
                    <h3>Update</h3>

                    <h5>Address:</h5>
                    <input
                        name='address'
                        placeholder='Address'
                        value={this.state.meeting.address}
                        onChange={this.handleUpdateAttr}
                    />

                    <h5>City:</h5>
                    <input
                        name='city'
                        placeholder='City'
                        value={this.state.meeting.city}
                        onChange={this.handleUpdateAttr}
                    />

                    <h5>State:</h5>
                    <select
                        name='state'
                        placeholder='State'
                        defaultValue={this.state.meeting.state}
                        onChange={this.handleUpdateAttr}
                    >
                        {states.map((state: State, i: number) => 
                            <option key={i} value={state.short}>{state.name}</option>)}
                    </select>

                    <h5>Zip:</h5>
                    <input
                        name='zip'
                        placeholder='Zip'
                        value={this.state.meeting.zip}
                        onChange={this.handleUpdateAttr}
                    />


                    <h5>Email:</h5>
                    <input
                        name='email'
                        placeholder='Email'
                        value={this.state.meeting.email}
                        onChange={this.handleUpdateAttr}
                    />


                    <h5>Phone:</h5>
                    <input
                        name='phone'
                        placeholder='Phone'
                        value={this.state.meeting.phone}
                        onChange={this.handleUpdateAttr}
                    />

                    <h5>Worship Style:</h5>
                    <select
                        onChange={this.handleMultiSelectFormChange}
                        className='worship_style'
                        multiple={true}
                        defaultValue={this.state.selectedTitles.worshipStyleTitles}>
                        {
                            this.state.titles.worshipStyleTitles.map((title: string, i: number) => 
                                <option value={title} key={i}>{title}</option>)
                        }
                    </select>

                    <h5>Yearly Meeting:</h5>
                    <select 
                        onChange={this.handleMultiSelectFormChange}
                        className='yearly_meeting' 
                        multiple={true}
                        defaultValue={this.state.selectedTitles.yearlyMeetingTitles}>
                        {
                            this.state.titles.yearlyMeetingTitles.map((title: string, i: number) =>
                                <option value={title} key={i}>{title}</option>)
                        }
                    </select>

                    <h5>Description:</h5>
                    <input
                        name='description'
                        placeholder='Description'
                        value={this.state.meeting.description}
                        onChange={this.handleUpdateAttr}
                    />


                    <h5>Website:</h5>
                    <input
                        name='website'
                        placeholder='Website'
                        value={this.state.meeting.website}
                        onChange={this.handleUpdateAttr}
                    />

                    <h5>Accessibility:</h5>
                    <select
                        onChange={this.handleMultiSelectFormChange}
                        className='accessibility'
                        multiple={true}
                        defaultValue={this.state.selectedTitles.accessibilityTitles}>
                        {
                            this.state.titles.accessibilityTitles.map((title: string, i: number) => 
                                <option value={title} key={i}>{title}</option>)
                        }
                    </select>

                    <h5>Branch:</h5>
                    <select
                        onChange={this.handleMultiSelectFormChange}
                        className='branch'
                        multiple={true}
                        defaultValue={this.state.selectedTitles.branchTitles}>
                        {
                            this.state.titles.branchTitles.map((title: string, i: number) =>
                                <option value={title} key={i}>{title}</option>)
                        }
                    </select>

                    <h5>LGBT-Affirming:</h5>
                    <div className='form-element'>
                        <input type='radio' name='lgbt_affirming' value='true'
                            checked={this.state.meeting.lgbt_affirming === true}
                            onChange={this.handleUpdateAttr} />
                        LGBT-Affirming
                        <input type='radio' name='lgbt_affirming' value='false'
                            checked={this.state.meeting.lgbt_affirming === false}
                            onChange={this.handleUpdateAttr} />
                        Non-Affirming
                    </div>

                    <button onClick={this.handleUpdateMeeting}>Update Meeting</button>
                </form>

                <h2>Delete</h2>

                <button onClick={this.handleDeleteMeeting}>Delete Meeting</button>
            </div>
        </div>
    )
}

export default ModifyMeetingModal;
