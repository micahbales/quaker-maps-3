import { Meeting } from '../Definitions';
import { getIds } from '../utils/helpers';

/**
 * getMeetingData fetches all relevant data for meetings from the Quaker Maps API.
 */

export const getMeetingData = async () => {
    const meetings = await fetch('/api/v1/meetings');
    const yearlymeetings = await fetch('/api/v1/meetings/yearlymeetings');
    const branches = await fetch('/api/v1/meetings/branches');
    const worshipStyles = await fetch('/api/v1/meetings/worshipstyles');
    const accessibilities = await fetch('/api/v1/meetings/accessibilities');

    if (meetings.status !== 200) throw Error(await meetings.json());
    if (yearlymeetings.status !== 200) throw Error(await yearlymeetings.json());
    if (branches.status !== 200) throw Error(await branches.json());
    if (worshipStyles.status !== 200) throw Error(await worshipStyles.json());
    if (accessibilities.status !== 200) throw Error(await accessibilities.json());

    return {
        meetings: (await meetings.json()).meetings,
        yearlymeetings: (await yearlymeetings.json()).yearlymeetings,
        branches: (await branches.json()).branches,
        worshipStyles: (await worshipStyles.json()).worshipstyles,
        accessibilities: (await accessibilities.json()).accessibilities,
    };
};

/**
 * deleteMeeting deletes the meeting passed to it.
 * This function returns a promise.
 */

export const deleteMeeting = (meeting: Meeting) => (
    fetch(`/api/v1/meetings/${meeting.id}`, {
        method: 'DELETE',
    })
)

/**
 * updateMeeting updates the meeting passed to it.
 * This function returns a promise.
 */

export const updateMeeting = (meeting: Meeting) => {
    // meetingUpdate is a modified version of a regular Meeting object
    // The difference being that instead of arrays of object entities for ym, branch, etc.,
    // meetingUpdate just has arrays of ids
    // TODO: Refactor API to accept regular Meeting objects?
    const meetingUpdate: any = { ...meeting };
    meetingUpdate.yearly_meeting = getIds(meeting.yearly_meeting);
    meetingUpdate.accessibility = getIds(meeting.accessibility);
    meetingUpdate.worship_style = getIds(meeting.worship_style);
    meetingUpdate.branch = getIds(meeting.branch);

    return fetch(`/api/v1/meetings/${meeting.id}`, {
        method: 'PUT',
        body: JSON.stringify(meetingUpdate),
        headers: { 'Content-Type': 'application/json' }
    });
}

/**
 * createMeeting creates a new meeting.
 * This function returns a promise.
 */

export const createMeeting = (meeting: Meeting) => {
    // same comments apply here as with updateMeeting
    const newMeeting: any = { ...meeting };
    newMeeting.yearly_meeting = getIds(meeting.yearly_meeting);
    newMeeting.accessibility = getIds(meeting.accessibility);
    newMeeting.worship_style = getIds(meeting.worship_style);
    newMeeting.branch = getIds(meeting.branch);

    return fetch(`/api/v1/meetings`, {
        method: 'POST',
        body: JSON.stringify({ meeting: newMeeting }),
        headers: { 'Content-Type': 'application/json' }
    });
}
