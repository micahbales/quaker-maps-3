import * as React from 'react';
import './styles/PopUpCard.css';
import RecordItemListing from '../RecordItemListing/RecordItemListing';

/**
 * PopUpCard is the content displayed in the popup when a map's meeting marker is clicked.
 */

interface PopUpCardProps {
    meeting: any;
}

const PopUpCard: React.SFC<PopUpCardProps> = ({ meeting }) => (
    <div className='meeting-card'>
        <h3>{meeting.title}</h3>
        <RecordItemListing
            label='Address'
            item={`${meeting.address} ${meeting.city} ${meeting.state} ${meeting.zip}`}
        />
        {/* <RecordItemListing 
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
            /> */}
        <RecordItemListing
            label='Description'
            item={meeting.description}
        />
        <RecordItemListing
            label='Website'
            item={meeting.website}
            link={meeting.website}
        />
        {/* <RecordItemListing 
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
            /> */}

        <div>
            <p>
                <a href={`/meetings/${meeting.slug}`}>
                    more info
                    </a>
            </p>
        </div>
    </div>
)

export default PopUpCard;
