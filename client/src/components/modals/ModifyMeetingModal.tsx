import * as React from 'react';
import '../../styles/components/ModifyMeetingModal.css';
import {Meeting, ModifyMeetingModalProps} from '../../Definitions';

class ModifyMeetingModal extends React.Component<ModifyMeetingModalProps> {

    public meeting: Meeting;
    public state: any;

    constructor(props: ModifyMeetingModalProps) {
        super(props);
        this.state = {
            meeting: this.props.meeting
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
        const state = Object.assign({}, this.state);
        // get titles of yms selected by user
        const yearlyMeetingNames: string[] = this.state.meeting[criterion].map((ym: Meeting) => ym.title);
        
        
        
        // const userInputValues: string[] = document.querySelector('.yearlymeeting').
        // const optionsElements: HTMLCollection = document.querySelector('.yearlymeeting').children;

        // [...optionsElements].filter((elem) => {
        //     console.log(elem)
        //     return elem.selected;
        // })



        

        // get selected yms from this.props.meetings

        // replace state.meeting.yearly_meeting with [...yms] & update state


        console.log(state.meeting.yearly_meeting.find((m: Meeting) => {
            return yearlyMeetingNames.includes(m.title);
        }));
        this.setState(state);
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
                                this.props.titles.yearlyMeetingTitles.map((s: string, i) => {
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
