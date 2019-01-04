import * as React from 'react';
import '../../styles/components/ModifyMeetingModal.css';
import {Meeting, ModifyMeetingModalProps} from '../../Definitions';

class ModifyMeetingModal extends React.Component<ModifyMeetingModalProps> {

    public meeting: Meeting;

    constructor(props: ModifyMeetingModalProps) {
        super(props);
        this.meeting = this.props.meeting;
        this.handleDeleteMeeting = this.handleDeleteMeeting.bind(this);
    }

    public handleModalClose() {
       const modal = document.querySelector('#modify-meeting');
       if (modal) modal.classList.add('hidden');
    }

    public handleDeleteMeeting() {
        fetch(`/api/v1/meetings/${this.meeting.id}`, {
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
                    <h2>Update {this.meeting.title}</h2>

                    <button onClick={this.handleDeleteMeeting}>Delete Meeting</button>
                </div>
            </div>
        )
    }
}

export default ModifyMeetingModal;
