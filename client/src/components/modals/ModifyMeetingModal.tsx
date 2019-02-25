import * as React from 'react';
import '../../styles/components/ModifyMeetingModal.css';
import { Meeting, Titles } from '../../Definitions';
import { getMultiSelectValues } from '../../utils/helpers';
import { deleteMeeting, updateMeeting } from '../../api/api';

/**
 * ModifyMeetingModal is a view where the user can update or delete a meeting.
 */

interface ModifyMeetingModalProps {
    meeting: Meeting;
    yearlymeetings: Meeting[];
    branches: any;
    worshipStyles: any;
    accessibilities: any;
    titles: Titles;
    history: any;
}

class ModifyMeetingModal extends React.Component<ModifyMeetingModalProps> {
    public meeting: Meeting;
    public state: any;

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

    public goToMainMap = () => {
        this.props.history.push('/');
        this.props.history.go();
    }

    public handleModalClose = () => {
        const modal = document.querySelector('#modify-meeting');
        if (modal) modal.classList.add('hidden');
    }

    public handleUpdateMeeting = (e: React.SyntheticEvent) => {
        updateMeeting(this.state.meeting)
            .then(this.goToMainMap);
    }

    public handleDeleteMeeting = () => {
        deleteMeeting(this.state.meeting)
            .then(this.goToMainMap);
    }

    public handleMultiSelectFormChange = (e: any) => {
        // Retrieve titles from selected options
        const field: string = e.target.className;
        const newTitles: string[] = getMultiSelectValues(e.target);

        // Assign updated group of entities (yms, branches, etc.) to this.state.meeting
        const state = {...this.state};
        const allPossibleEntities: any[] = this.state[field];
        state.meeting[field] = allPossibleEntities.filter((ent) => newTitles.includes(ent.title));
        this.setState(state);
    }

    public render = () => (
        <div id='modify-meeting' className='hidden'>
            <div className='content'>
                <span className='close' onClick={this.handleModalClose}>
                    &times;
                </span>
                
                <h1>{this.state.meeting.title}</h1>

                <form>
                    <h3>Update</h3>

                    <h5>Yearly Meeting:</h5>
                    <select 
                        onChange={this.handleMultiSelectFormChange}
                        className='yearly_meeting' 
                        multiple={true}
                        defaultValue={this.state.selectedTitles.yearlyMeetingTitles}>
                        {
                            this.state.titles.yearlyMeetingTitles.map((title: string, i: number) => {
                                return (
                                    <option
                                        value={title}
                                        key={i}>
                                        {title}
                                    </option>
                                );
                            })
                        }
                    </select>

                    <h5>Accessibility:</h5>
                    <select
                        onChange={this.handleMultiSelectFormChange}
                        className='accessibility'
                        multiple={true}
                        defaultValue={this.state.selectedTitles.accessibilityTitles}>
                        {
                            this.state.titles.accessibilityTitles.map((title: string, i: number) => {
                                return (
                                    <option
                                        value={title}
                                        key={i}>
                                        {title}
                                    </option>
                                );
                            })
                        }
                    </select>

                    <h5>Branch:</h5>
                    <select
                        onChange={this.handleMultiSelectFormChange}
                        className='branch'
                        multiple={true}
                        defaultValue={this.state.selectedTitles.branchTitles}>
                        {
                            this.state.titles.branchTitles.map((title: string, i: number) => {
                                return (
                                    <option
                                        value={title}
                                        key={i}>
                                        {title}
                                    </option>
                                );
                            })
                        }
                    </select>

                    <h5>Worship Style:</h5>
                    <select
                        onChange={this.handleMultiSelectFormChange}
                        className='worship_style'
                        multiple={true}
                        defaultValue={this.state.selectedTitles.worshipStyleTitles}>
                        {
                            this.state.titles.worshipStyleTitles.map((title: string, i: number) => {
                                return (
                                    <option
                                        value={title}
                                        key={i}>
                                        {title}
                                    </option>
                                );
                            })
                        }
                    </select>

                    <button onClick={this.handleUpdateMeeting}>Update Meeting</button>
                </form>

                <h2>Delete</h2>

                <button onClick={this.handleDeleteMeeting}>Delete Meeting</button>
            </div>
        </div>
    )
}

export default ModifyMeetingModal;
