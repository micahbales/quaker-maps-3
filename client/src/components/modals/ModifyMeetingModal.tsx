import * as React from 'react';
import '../../styles/components/ModifyMeetingModal.css';
import {Meeting, Titles} from '../../Definitions';

interface ModifyMeetingModalProps {
    meeting: Meeting;
    yearlymeetings: Meeting[];
    branches: any;
    worshipStyles: any;
    accessibilities: any;
    titles: Titles;
    history: any;
}

function getIds(collection: any[]) {
    if (!collection || collection.length < 1) return null;
    // Return an array of ids
    return collection.map((c: any) => c.id)
}

function getMultiSelectValues(multiSelectElement: any) {
    const values = []
    const optionsLength = multiSelectElement.options.length;
    let option;

    for (let i = 0; i < optionsLength; i++) {
        // Check every option in the multi-select
        option = multiSelectElement.options[i];

        // If it is selected, include it in the returned values array
        if (option.selected) {
            values.push(option.value);
        }
    }

    return values;
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

    public handleModalClose() {
        const modal = document.querySelector('#modify-meeting');
        if (modal) modal.classList.add('hidden');
    }

    public handleUpdateMeeting = (e: React.SyntheticEvent) => {
        e.preventDefault();

        // meetingUpdate is a modified version of a regular Meeting object
        // The difference being that instead of arrays of object entities for ym, branch, etc.,
        // meetingUpdate just has arrays of ids
        // TODO: Refactor API to accept regular Meeting objects?
        const meetingUpdate: any = {...this.state.meeting};
        meetingUpdate.yearly_meeting = getIds(this.state.meeting.yearly_meeting);
        meetingUpdate.accessibility = getIds(this.state.meeting.accessibility);
        meetingUpdate.worship_style = getIds(this.state.meeting.worship_style);
        meetingUpdate.branch = getIds(this.state.meeting.branch);

        fetch(`/api/v1/meetings/${this.state.meeting.id}`, {
            method: 'PUT',
            body: JSON.stringify(meetingUpdate),
            headers: {'Content-Type': 'application/json'}
        })
            .then(() => {
                this.props.history.push('/');
                this.props.history.go();
            });
    }

    public handleDeleteMeeting = () => {
        fetch(`/api/v1/meetings/${this.state.meeting.id}`, {
            method: 'DELETE',
        })
            .then(() => {
                this.props.history.push('/');
                this.props.history.go();
            });
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

    public render() {
        return (
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
                            className='worship-style'
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
}

export default ModifyMeetingModal;
