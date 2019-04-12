import * as React from 'react';
import RecordItemListing from '../RecordItemListing/RecordItemListing';
import ModifyMeetingModal from '../modals/ModifyMeetingModal/ModifyMeetingModal';
import { Meeting, Titles } from '../../Definitions';
import { Button, Link } from '@material-ui/core';

/**
 * MeetingView is the details view for a single meeting.
 */

interface MeetingViewProps {
    history: any;
    meeting: Meeting;
    yearlymeetings: Meeting[];
    branches: any;
    worshipStyles: any;
    accessibilities: any;
    titles: Titles;
}

const MeetingView: React.FC<MeetingViewProps> = ({
    history,
    meeting,
    yearlymeetings,
    branches,
    worshipStyles,
    accessibilities,
    titles
}) => {

    const handleOpenModifyMeetingModal = () => {
        const modal = document.querySelector('#modify-meeting');
        if (modal) modal.classList.remove('hidden');
    }

    return (
        <div className='meeting-card'>
            <ModifyMeetingModal
                meeting={meeting}
                yearlymeetings={yearlymeetings}
                branches={branches}
                worshipStyles={worshipStyles}
                accessibilities={accessibilities}
                titles={titles}
                history={history} />
            <h3>{meeting.title}</h3>
            <RecordItemListing
                label='Address'
                item={`${meeting.address} ${meeting.city} ${meeting.state} ${meeting.zip}`}
            />
            <RecordItemListing
                label='Email'
                item={meeting.email}
            />
            <RecordItemListing
                label='Phone'
                item={meeting.phone}
            />
            <RecordItemListing
                label='Branch'
                item={meeting.branch}
            />
            <RecordItemListing
                label='Worship Style'
                item={meeting.worship_style}
            />
            <RecordItemListing
                label='Description'
                item={meeting.description}
            />
            <RecordItemListing
                label='Website'
                item={meeting.website}
                link={meeting.website}
            />
            <RecordItemListing
                label='Yearly Meeting'
                item={meeting.yearly_meeting}
            />
            <RecordItemListing
                label='Accessibility'
                item={meeting.accessibility}
            />
            <RecordItemListing
                label='LGBT Affirming*'
                item={meeting.lgbt_affirming ? 'Yes' : 'No'}
            />

            <Link block={true} underline='always' href='/'>Back to Main Map</Link>

            <Button onClick={handleOpenModifyMeetingModal}>Modify Meeting</Button>
        </div>
    );
}

export default MeetingView;
