import * as React from 'react';

interface IProps {
    meeting: any;
    key: number;
}

class MeetingCard extends React.Component<IProps> {
    private meeting: any;
    private key: number;

    constructor(props: IProps) {
        super(props);
        this.meeting = this.props.meeting;
        this.key = this.props.key
    }

    public render() {
        return (
            <div className='meeting-card' key={this.key}>
                <h3>{this.meeting.title}</h3>
                <p>
                    <label>Address: </label>
                    {this.meeting.address + ' '} 
                    {this.meeting.city + ' '} 
                    {this.meeting.state + ' '} 
                    {this.meeting.zip}
                </p>
                <p>
                    <label>Email: </label>
                    {this.meeting.email}
                </p>
                <p>
                    <label>Phone: </label>
                    {this.meeting.phone}
                </p>
                <p>
                    <label>Description: </label>
                    {this.meeting.description}
                </p>
                <p>
                    <label>Website: </label>
                    <a href={this.meeting.website}>
                        {this.meeting.website}
                    </a>
                </p>
                <p>
                    <label>LGBT Affirming*: </label>
                    {this.meeting.lgbt_affirming ? 'Yes' : 'No'}
                </p>
            </div>
        )
    }
}

export default MeetingCard;