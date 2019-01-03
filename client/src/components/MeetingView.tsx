import * as React from 'react';
import RecordItemListing from './RecordItemListing';
import {MeetingViewProps} from './../Definitions';

class MeetingView extends React.Component<MeetingViewProps> {
    private meeting: any;

    constructor(props: MeetingViewProps) {
        super(props);
        this.meeting = this.props.meeting;
        this.handleDeleteMeetingClick = this.handleDeleteMeetingClick.bind(this);
    }

    public handleDeleteMeetingClick() {
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
            <div className='meeting-card'>
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

                <button onClick={this.handleDeleteMeetingClick}>Delete Meeting</button>
            </div>
        )
    }
}

export default MeetingView;
