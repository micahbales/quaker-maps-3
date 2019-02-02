import * as React from 'react';
import '../../styles/components/ModifyMeetingModal.css';
import {Meeting, ModifyMeetingModalProps} from '../../Definitions';

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

                        <select 
                            className='yearlymeeting' 
                            multiple={true}
                            defaultValue={this.state.selectedTitles.yearlyMeetingTitles}>
                            <option value=''>Yearly Meeting</option>
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
                    </form>

                    <h2>Delete</h2>

                    <button onClick={this.handleDeleteMeeting}>Delete Meeting</button>
                </div>
            </div>
        )
    }
}

export default ModifyMeetingModal;
