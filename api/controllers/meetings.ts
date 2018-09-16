import {query} from '../utils/utils';

// GET /meetings
export const getAllMeetings = async (req, res) => {
    const meetings = await query(
        'SELECT * FROM meeting;'
    );

    res.json({meetings: meetings.rows});
};

// GET /yearlymeetings
export const getYearlyMeetings = async (req, res) => {
    const meetings = await query(
        'SELECT meeting.* FROM meeting ' +
        ' WHERE meeting.id NOT IN (SELECT meeting_id FROM meeting_yearly_meeting);'
    );

    res.json({meetings: meetings.rows});
};

// GET /meetings/:id
export const getMeetingById = async (req, res) => {
    const meetingId = req.params.id;
    const meetings = await query(
        'SELECT * FROM meeting ' +
        ' WHERE id = ' + meetingId + ';'
    );

    res.json({meetings: meetings.rows});
};

// POST /meetings
export const createMeeting = async (req, res) => {
    const queryString = 'INSERT INTO meeting ' +
    ' (title, longitude, mappable, phone, email, city, address, latitude, zip, ' +
    ' description, worship_time, state, website, lgbt_affirming) ' +
    ' VALUES ($1, $2::numeric, $3, $4, $5, $6, $7, $8::numeric, $9, $10, $11, $12, $13, $14);';
    const values: string[] = Object.values(req.body.meeting);

    const meeting = await query(queryString, values);

    res.status(201).send({meeting});
};
