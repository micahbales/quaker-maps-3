import axios from 'axios';
import {
    query,
    getKeys,
    getValues,
    getQueryBling,
    getKeyValueQueryString,
    removeJoinKeys,
    getMeetingAttributeRecords,
    createMeetingAttributeRecords,
    deleteMeetingAttributeRecords
} from '../utils/utils';

// GET /meetings
export const getAllMeetings = async (req, res) => {
    const meetings = await query(
        `SELECT * FROM meeting;`
    );

    getMeetingAttributeRecords(meetings)
        .then(() => {
            res.json({meetings: meetings.rows});
        });
};

// GET /meetings/yearlymeetings
export const getYearlyMeetings = async (req, res) => {
    const meetings = await query(
        `SELECT * FROM meeting
        WHERE id NOT IN (
            SELECT meeting_id FROM meeting_yearly_meeting
        );`
    );

    getMeetingAttributeRecords(meetings)
        .then(() => {
            res.json({yearlymeetings: meetings.rows});
        });
};

// GET /meetings/branches
export const getBranches = async (req, res) => {
    const branches = await query(`SELECT * FROM branch;`);
    res.json({branches: branches.rows});
};

// GET /meetings/worshipstyles
export const getWorshipStyles = async (req, res) => {
    const worshipstyles = await query(`SELECT * FROM worship_style;`);
    res.json({worshipstyles: worshipstyles.rows});
};

// GET /meetings/accessibilities
export const getAccessibilities = async (req, res) => {
    const accessibilities = await query(`SELECT * FROM accessibility;`);
    res.json({accessibilities: accessibilities.rows});
};

// GET /meetings/:id
export const getMeetingById = async (req, res) => {
    const meetingId = req.params.id;
    const meetings = await query(
        `SELECT * FROM meeting
        WHERE id = ${meetingId};`
    );

    getMeetingAttributeRecords(meetings)
        .then(() => {
            res.json({meetings: meetings.rows});
        });
};

const getFormattedAddress = (address: string, city: string, state: string, zip: string) => {
    const formattedAddress = address.trim().replace(/\s+/g, '+');
    return `${formattedAddress},${city},${state},${zip}`;
};

// POST /meetings
export const createMeeting = async (req, res) => {
    const meetingWithAttributeRecordIds = req.body.meeting;
    const newMeeting = removeJoinKeys(meetingWithAttributeRecordIds);

    if (newMeeting.address) {
        const formattedAddress = getFormattedAddress(
            req.body.meeting.address,
            req.body.meeting.city,
            req.body.meeting.state,
            req.body.meeting.zip
        );
        const url = `http://www.mapquestapi.com/geocoding/v1/address?key=` +
            `${process.env.MAPQUESTKEY}&location=${formattedAddress}`;
        const locationData: any = await axios.get(url)
            .catch((err) => {
                console.error(err);
            });
        newMeeting.latitude = Number(locationData.data.results[0].locations[0].latLng.lat);
        newMeeting.longitude = Number(locationData.data.results[0].locations[0].latLng.lng);
    }


    const meetingQueryString = 'INSERT INTO meeting (' + getKeys(newMeeting) + ') ' +
                        ' VALUES (' + getQueryBling(newMeeting) + ')' +
                        // Return the id of the newly created meeting
                        'RETURNING *' + ';';
    const meeting = await query(meetingQueryString, getValues(newMeeting));
    const meetingId = meeting.rows[0].id;

    createMeetingAttributeRecords(meetingWithAttributeRecordIds, meetingId)
        .then(() => {
            res.status(200).send({meeting: meeting});
        });
};

// PUT /meetings/:id
export const updateMeeting = async (req, res) => {
    const meetingWithAttributeRecordIds = req.body;
    const updatedMeeting = removeJoinKeys(meetingWithAttributeRecordIds);
    const meetingId = req.params.id;
    const queryString = 'UPDATE meeting ' +
                        ' SET ' +
                        getKeyValueQueryString(updatedMeeting) +
                        ' WHERE id = ' + meetingId + ';';

    await query(queryString);

    await deleteMeetingAttributeRecords(meetingId);

    createMeetingAttributeRecords(meetingWithAttributeRecordIds, meetingId)
        .then(() => {
            res.status(200).send({});
        });
};

// DELETE /meetings/:id
export const deleteMeeting = async (req, res) => {
    const meetingId = req.params.id;
    const meeting = await query(
        'DELETE FROM meeting ' +
        ' WHERE id = ' + meetingId + ';'
    );

    await deleteMeetingAttributeRecords(meetingId);

    res.json({meeting: meeting});
};
