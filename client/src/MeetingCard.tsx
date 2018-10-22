import * as React from 'react';
import './styles/MeetingCard.css';

interface MeetingCardProps {
    meeting: any;
}

interface RecordItemListingProps {
    item: any;
    label: string;
    link?: string;
}

const RecordItemListing: React.SFC<RecordItemListingProps> = (props) => {
    if (Array.isArray(props.item)) {
        return (
            <div className='record-item-listing'>
                <label>{props.label}: </label>
                <ul>
                    {
                        props.item.map((o: any, i: number) => {
                            return <li key={i}>{o.title}</li>;
                        })
                    }
                </ul>
            </div>
        );
    }
    if (props.link) {
        return (
            <div>
                <p>
                    <label>{props.label}: </label>
                    <a href={props.link}>{props.item}</a>
                </p>
            </div>
        );
    }
    return (
        <div>
            <p>
                <label>{props.label}: </label>
                {props.item}
            </p>
        </div>
    );
};


class MeetingCard extends React.Component<MeetingCardProps> {
    private meeting: any;

    constructor(props: MeetingCardProps) {
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

export default MeetingCard;
