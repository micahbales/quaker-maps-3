import * as React from 'react';
import '../../styles/components/ModifyMeetingModal.css';
import { Meeting, UpdateMeetingProps } from '../../Definitions';
import { deleteMeeting, updateMeeting } from '../../api/api';
import { convertStringBooleans, getMultiSelectValues } from '../../utils/helpers'
import { UpdateMeetingForm } from '../UpdateMeetingForm';

/**
 * ModifyMeetingModal is a view where the user can update or delete a meeting.
 */

interface ModifyMeetingProps extends UpdateMeetingProps {
    meeting: Meeting;
}

class ModifyMeetingModal extends React.Component<ModifyMeetingProps> {
    meeting: Meeting;
    state: any;

    constructor(props: ModifyMeetingProps) {
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
    };

    handleModalClose = () => {
        const modal = document.querySelector('#modify-meeting');
        if (modal) modal.classList.add('hidden');
    };

    handleUpdateMeeting = () => {
        updateMeeting(this.state.meeting);
    };

    handleDeleteMeeting = () => {
        deleteMeeting(this.state.meeting)
            .then(() => {
                this.props.history.push('/');
                this.props.history.go();
            });
    };

    handleMultiSelectFormChange = (e: any) => {
        // Retrieve titles from selected options
        const field: string = e.target.className;
        const newTitles: string[] = getMultiSelectValues(e.target);

        // Assign updated group of entities (yms, branches, etc.) to this.state.meeting
        const state = { ...this.state };
        const allPossibleEntities: any[] = this.state[field];
        state.meeting[field] = allPossibleEntities.filter((ent) => newTitles.includes(ent.title));
        this.setState(state);
    };

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
                
                <h3>Update</h3>

                <UpdateMeetingForm
                    meeting={this.state.meeting}
                    handleMultiSelectFormChange={this.handleMultiSelectFormChange}
                    handleUpdateAttr={this.handleUpdateAttr}
                    handleUpdateMeeting={this.handleUpdateMeeting}
                    selectedTitles={this.state.selectedTitles}
                    titles={this.state.titles}
                />

                <h2>Delete</h2>

                <button onClick={this.handleDeleteMeeting}>Delete Meeting</button>
            </div>
        </div>
        
    )
}

export default ModifyMeetingModal;
