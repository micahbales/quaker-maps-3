import * as React from 'react';
import '../../styles/components/ModifyMeetingModal.css';
import {Meeting, ModifyMeetingModalProps} from '../../Definitions';

class ModifyMeetingModal extends React.Component<ModifyMeetingModalProps> {

    public meeting: Meeting;
    public yearlymeetings = ['Great Plains Yearly Meeting', 'EFC - Mid America Yearly Meeting'];
    public state: any;

    constructor(props: ModifyMeetingModalProps) {
        super(props);
        this.state = {
            meeting: this.props.meeting,
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

    public handleInputChange(criterion: string) {
        console.log(criterion);
        // console.log(this.state.meeting.yearly_meeting.map((ym: Meeting) => ym.title));
    }

    public render() {
        return (
            <div id='modify-meeting' className='hidden'>
                <div className='content'>
                    <span className='close' onClick={this.handleModalClose}>
                        &times;
                    </span>
                    <h2>Update {this.state.meeting.title}</h2>

                    <select className='yearlymeeting' 
                            multiple={true}
                            value={this.state.meeting.yearly_meeting.map((ym: Meeting) => ym.title)}
                            onChange={this.handleInputChange.bind(this, 'yearly_meeting')}>
                            <option value=''>Yearly Meeting</option>
                            {
                                this.yearlymeetings.map((s: string, i) => {
                                    return (
                                        <option value={s} key={i}>{s}</option>
                                    );
                                })
                            }
                        </select>

                    <button onClick={this.handleDeleteMeeting}>Delete Meeting</button>
                </div>
            </div>
        )
    }
}

export default ModifyMeetingModal;
