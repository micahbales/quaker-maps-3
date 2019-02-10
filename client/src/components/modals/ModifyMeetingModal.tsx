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

class ModifyMeetingModal extends React.Component<ModifyMeetingModalProps> {

    public meeting: Meeting;
    public state: any;

    constructor(props: ModifyMeetingModalProps) {
        super(props);
        this.state = {
            meeting: this.props.meeting,
            titles: this.props.titles,
            selectedTitles: {
                yearlyMeetingTitles: this.props.meeting.yearly_meeting.map((ym) => ym.title),
                accessibilityTitles: this.props.meeting.accessibility.map((a) => a.title),
                worshipStyleTitles: this.props.meeting.worship_style.map((ws) => ws.title),
                branchTitles: this.props.meeting.branch.map((b) => b.title)
            },
        };
        this.handleDeleteMeeting = this.handleDeleteMeeting.bind(this);
    }

    public handleModalClose() {
        const modal = document.querySelector('#modify-meeting');
        if (modal) modal.classList.add('hidden');
    }

    public handleDeleteMeeting() {
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
                    </form>

                    <h2>Delete</h2>

                    <button onClick={this.handleDeleteMeeting}>Delete Meeting</button>
                </div>
            </div>
        )
    }
}

export default ModifyMeetingModal;
