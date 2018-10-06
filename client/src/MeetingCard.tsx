import * as React from 'react';

interface MeetingCardProps {
    meeting: any;
    key: number;
}

interface RecordItemListingProps {
    item: string;
    label: string;
    link?: string;
}

const RecordItemListing: React.SFC<RecordItemListingProps> = (props) => {
    if (props.link) {
        return (
            <div>
                <p>
                    <label>{props.label}: </label>
                    <a href={props.link}>{props.item}</a>
                </p>
            </div>
        )
    }
    return (
        <div>
            <p>
                <label>{props.label}: </label>
                {props.item}
            </p>
        </div>
    )
};


class MeetingCard extends React.Component<MeetingCardProps> {
    private meeting: any;
    private key: number;

    constructor(props: MeetingCardProps) {
        super(props);
        this.meeting = this.props.meeting;
        this.key = this.props.key
    }

    public render() {
        return (
            <div className='meeting-card' key={this.key}>
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

export default MeetingCard;