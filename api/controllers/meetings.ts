import {
    query,
    getKeys,
    getValues,
    getQueryBling,
    getKeyValueQueryString
} from '../utils/utils';

// GET /meetings
export const getAllMeetings = async (req, res) => {
    const meetings = await query(
        `SELECT m1.*,
        (SELECT string_agg(m2.title, ', ')
               FROM meeting_yearly_meeting mym1
                    LEFT JOIN meeting m2
                              ON m2.id = mym1.yearly_meeting_id
               WHERE mym1.meeting_id = m1.id) yearly_meeting
        FROM meeting m1;`
    );

    // TODO:
    // We need to include yearly meeting, (check)
                        // worship style,
                        // branch,
                        // and accessibility
    // in the records we send back to the client
    // This will mean a lot of joins for this query

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
    const newMeeting = req.body.meeting;
    const queryString = 'INSERT INTO meeting (' + getKeys(newMeeting) + ') ' +
                        ' VALUES (' + getQueryBling(newMeeting) + ');';

    const meeting = await query(queryString, getValues(newMeeting));

    res.status(201).send({meeting});
};

// PUT /meetings/:id
export const updateMeeting = async (req, res) => {
    const meetingId = req.params.id;
    const meeting = req.body.meeting;
    const queryString = 'UPDATE meeting ' +
                        ' SET ' +
                        getKeyValueQueryString(meeting) +
                        ' WHERE id = ' + meetingId + ';';

    const meetings = await query(queryString);

    res.status(204).json({meetings: meetings.rows});
};

// DELETE /meetings/:id
export const deleteMeeting = async (req, res) => {
    const meetingId = req.params.id;
    const meeting = await query(
        'DELETE FROM meeting ' +
        ' WHERE id = ' + meetingId + ';'
    );

    res.json({meeting});
};
