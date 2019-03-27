import * as React from 'react';
import { convertStringBooleans, getMultiSelectValues } from '../utils/helpers'
import { NewMeeting, UpdateMeetingProps } from '../Definitions';
import { UpdateMeetingForm } from './UpdateMeetingForm';
import { createMeeting } from '../api/api'

/**
 * CreateMeetingView is a view where the user can create a new meeting.
 */

interface CreateMeetingProps extends UpdateMeetingProps {
    meeting: NewMeeting;
}

export class CreateMeetingView extends React.Component<CreateMeetingProps> {
    meeting: NewMeeting;
    state: any;

    constructor(props: CreateMeetingProps) {
        super(props);
        this.state = {
            meeting: this.props.meeting,
            titles: this.props.titles,
            yearly_meeting: this.props.yearlymeetings,
            branch: this.props.branches,
            accessibility: this.props.accessibilities,
            worship_style: this.props.worshipStyles,
            selectedTitles: {
                yearlyMeetingTitles: [],
                accessibilityTitles: [],
                worshipStyleTitles: [],
                branchTitles: []
            },
        };
    };

    handleCreateMeeting = (e: React.SyntheticEvent) => {
        e.preventDefault();
        createMeeting(this.state.meeting)
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
        <>
            <h1>{this.state.meeting.title || 'New Meeting'}</h1>
            
            <h3>Create Meeting</h3>
            
            <UpdateMeetingForm
                meeting={this.state.meeting}
                handleMultiSelectFormChange={this.handleMultiSelectFormChange}
                handleUpdateAttr={this.handleUpdateAttr}
                handleUpdateMeeting={this.handleCreateMeeting}
                selectedTitles={this.state.selectedTitles}
                titles={this.state.titles}
            />
        </>
    );
}
