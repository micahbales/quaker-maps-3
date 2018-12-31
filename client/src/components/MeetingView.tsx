import * as React from 'react';
import RecordItemListing from './RecordItemListing';
import {MeetingCardViewProps} from './../Definitions';

class MeetingCardView extends React.Component<MeetingCardViewProps> {
    private meeting: any;

    constructor(props: MeetingCardViewProps) {
        super(props);
        this.meeting = this.props.meeting;
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
            </div>
        )
    }
}

export default MeetingCardView;
