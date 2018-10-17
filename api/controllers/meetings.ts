import {
    query,
    getKeys,
    getValues,
    getQueryBling,
    getKeyValueQueryString,
    removeJoinKeys,
    getMeetingAttributeRecords,
    createMeetingAttributeRecords
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

// GET /yearlymeetings
export const getYearlyMeetings = async (req, res) => {
    const meetings = await query(
        `SELECT * FROM meeting
        WHERE id NOT IN (
            SELECT meeting_id FROM meeting_yearly_meeting
        );`
    );

    getMeetingAttributeRecords(meetings)
        .then(() => {
            res.json({meetings: meetings.rows});
        });
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

// POST /meetings
export const createMeeting = async (req, res) => {
    const meetingWithAttributeRecordIds = req.body.meeting;
    const newMeeting = removeJoinKeys(meetingWithAttributeRecordIds);
    const meetingQueryString = 'INSERT INTO meeting (' + getKeys(newMeeting) + ') ' +
                        ' VALUES (' + getQueryBling(newMeeting) + ')' +
                        // Return the idea of the newly created meeting
                        'RETURNING *' + ';';
    const meeting = await query(meetingQueryString, getValues(newMeeting));
    const meetingId = meeting.rows[0].id;

    createMeetingAttributeRecords(meetingWithAttributeRecordIds, meetingId)
        .then(() => {
            res.status(200).send({meeting});
        });
};

// PUT /meetings/:id
export const updateMeeting = async (req, res) => {
    const meetingWithAttributeRecordIds = req.body.meeting;
    const updatedMeeting = removeJoinKeys(meetingWithAttributeRecordIds);
    const meetingId = req.params.id;
    const queryString = 'UPDATE meeting ' +
                        ' SET ' +
                        getKeyValueQueryString(updatedMeeting) +
                        ' WHERE id = ' + meetingId + ';';

    await query(queryString);

    // Delete yearly meeting records
    await query(
        `DELETE FROM meeting_yearly_meeting
        WHERE meeting_yearly_meeting.meeting_id = ${meetingId};`
    );

    // Delete worship style records
    await query(
        `DELETE FROM meeting_worship_style
        WHERE meeting_worship_style.meeting_id = ${meetingId};`
    );

    // Delete branch records
    await query(
        `DELETE FROM meeting_branch
        WHERE meeting_branch.meeting_id = ${meetingId};`
    );

    // Delete accessibility records
    await query(
        `DELETE FROM meeting_accessibility
        WHERE meeting_accessibility.meeting_id = ${meetingId};`
    );

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

    // Also delete join tables for yearly_meeting, branch, worship_style, and accessibility

    res.json({meeting});
};
