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

function getIds(collection: any[], selectedTitles: any[]) {
    if (! collection || collection.length < 1) return null;
    return collection
        .filter((c: any) => selectedTitles.includes(c.title))
        .map((c: any) => c.id)
}

class ModifyMeetingModal extends React.Component<ModifyMeetingModalProps> {
    public meeting: Meeting;
    public state: any;

    constructor(props: ModifyMeetingModalProps) {
        super(props);
        this.state = {
            meeting: this.props.meeting,
            titles: this.props.titles,
            yearlymeetings: this.props.yearlymeetings,
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

        const meetingUpdate: any = this.state.meeting;
        meetingUpdate.yearly_meeting = null;
        meetingUpdate.accessibility = getIds(this.state.accessibility, this.state.selectedTitles.accessibilityTitles);
        meetingUpdate.worship_style = getIds(this.state.yearlymeetings, this.state.selectedTitles.worshipStyleTitles);
        meetingUpdate.branch = getIds(this.state.yearlymeetings, this.state.selectedTitles.branchTitles);

        fetch(`http://localhost:7777/api/v1/meetings/${this.state.meeting.id}`, {
            method: 'PUT',
            body: JSON.stringify(meetingUpdate),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                // this.props.history.push('/');
                // this.props.history.go();
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
                            className='yearlymeeting' 
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
