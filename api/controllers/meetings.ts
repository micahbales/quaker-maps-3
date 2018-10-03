import {
    query,
    getKeys,
    getValues,
    getQueryBling,
    getKeyValueQueryString,
    removeJoinKeys
} from '../utils/utils';

// Get all meetings with yearly_meeting, worship_style, branch, and accessibility fields
const getMeetingsQuery = ` SELECT m1.*,

(SELECT string_agg(m2.title, ', ')
       FROM meeting_yearly_meeting mym1
            LEFT JOIN meeting m2
                    ON m2.id = mym1.yearly_meeting_id
       WHERE mym1.meeting_id = m1.id) AS yearly_meeting,

(SELECT string_agg(ws1.title, ', ')
        FROM meeting_worship_style mws1
            LEFT JOIN worship_style ws1
                    ON ws1.id = mws1.worship_style_id
        WHERE mws1.meeting_id = m1.id) AS worship_style,

(SELECT string_agg(b1.title, ', ')
        FROM meeting_branch mb1
            LEFT JOIN branch b1
                    ON b1.id = mb1.branch_id
        WHERE mb1.meeting_id = m1.id) AS branch,

(SELECT string_agg(a1.title, ', ')
        FROM meeting_accessibility ma1
            LEFT JOIN accessibility a1
                    ON a1.id = ma1.accessibility_id
        WHERE ma1.meeting_id = m1.id) AS accessibility

FROM meeting m1 `;

// GET /meetings
export const getAllMeetings = async (req, res) => {
    const meetings = await query(
         getMeetingsQuery + `;`
    );

    res.json({meetings: meetings.rows});
};

// GET /yearlymeetings
export const getYearlyMeetings = async (req, res) => {
    const meetings = await query(
        `${getMeetingsQuery}
        WHERE m1.id NOT IN (SELECT meeting_id FROM meeting_yearly_meeting);`
    );

    res.json({meetings: meetings.rows});
};

// GET /meetings/:id
export const getMeetingById = async (req, res) => {
    const meetingId = req.params.id;
    const meetings = await query(
        `${getMeetingsQuery}
        WHERE id = ${meetingId};`
    );

    res.json({meetings: meetings.rows});
};

// POST /meetings
export const createMeeting = async (req, res) => {
    const yearlyMeetingIds: number[] = req.body.meeting.yearly_meeting;
    const worshipStyleIds: number[] = req.body.meeting.worship_style;
    const branchIds: number[] = req.body.meeting.branch;
    const accessibilityIds: number [] = req.body.meeting.accessibility;
    const newMeeting = removeJoinKeys(req.body.meeting);

    // Add new meeting record
    const meetingQueryString = 'INSERT INTO meeting (' + getKeys(newMeeting) + ') ' +
                        ' VALUES (' + getQueryBling(newMeeting) + ')' +
                        // Return the idea of the newly created meeting
                        'RETURNING id' + ';';
    const meeting = await query(meetingQueryString, getValues(newMeeting));

    // Create meeting's yearly_meeting(s)
    const newMeetingYearlyMeetings = [];
    yearlyMeetingIds.forEach((ymId) => {
        newMeetingYearlyMeetings.push({
            meeting_id: meeting.rows[0].id,
            yearly_meeting_id: ymId
        });
    });

    newMeetingYearlyMeetings.forEach(async (mym, i) => {
        const mymQueryString = 'INSERT INTO meeting_yearly_meeting(' + getKeys(mym) + ') ' +
                        ' VALUES (' + getQueryBling(mym) + ')' +
                        ';';

        await query(
            mymQueryString,
            getValues(mym)
            );
    });

    // worship_style

    // branch

    // accessibility

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
