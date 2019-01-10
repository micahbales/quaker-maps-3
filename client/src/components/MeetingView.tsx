import * as React from 'react';
import RecordItemListing from './RecordItemListing';
import ModifyMeetingModal from './modals/ModifyMeetingModal';
import {MeetingViewProps} from './../Definitions';

class MeetingView extends React.Component<MeetingViewProps> {
    private meeting: any;

    constructor(props: MeetingViewProps) {
        super(props);
        this.meeting = this.props.meeting;
        this.handleOpenModifyMeetingModal = this.handleOpenModifyMeetingModal.bind(this);
    }

    public handleOpenModifyMeetingModal() {
        const modal = document.querySelector('#modify-meeting');
        if (modal) modal.classList.remove('hidden');
    }

    public render() {
        return (
            <div className='meeting-card'>
                <ModifyMeetingModal
                    meeting={this.meeting}
                    yearlymeetings={this.props.yearlymeetings}
                    branches={this.props.branches}
                    worshipStyles={this.props.worshipStyles}
                    accessibilities={this.props.accessibilities}
                    titles={this.props.titles}
                    history={this.props.history} />
                <h3>{this.meeting.title}</h3>
                <RecordItemListing 
                    label='Address' 
                    item={`${this.meeting.address} ${this.meeting.city} ${this.meeting.state} ${this.meeting.zip}`}
                />
                <RecordItemListing 
                    label='Email' 
                    item={this.meeting.email}
                />
                <RecordItemListing 
                    label='Phone' 
                    item={this.meeting.phone}
                />
                <RecordItemListing 
                    label='Branch' 
                    item={this.meeting.branch}
                />
                <RecordItemListing 
                    label='Worship Style' 
                    item={this.meeting.worship_style} 
                />
                <RecordItemListing 
                    label='Description' 
                    item={this.meeting.description} 
                />
                <RecordItemListing 
                    label='Website' 
                    item={this.meeting.website}
                    link={this.meeting.website}
                />
                <RecordItemListing 
                    label='Yearly Meeting' 
                    item={this.meeting.yearly_meeting}
                />
                <RecordItemListing 
                    label='Accessibility' 
                    item={this.meeting.accessibility}
                />
                <RecordItemListing 
                    label='LGBT Affirming*' 
                    item={this.meeting.lgbt_affirming ? 'Yes' : 'No'}
                />

                <h4><a href='/'>Back to Main Map</a></h4>

                <button onClick={this.handleOpenModifyMeetingModal}>Modify Meeting</button>
            </div>
        )
    }
}

export default MeetingView;
