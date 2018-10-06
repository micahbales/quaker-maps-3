import {
    query,
    getKeys,
    getValues,
    getQueryBling,
    getKeyValueQueryString,
    removeJoinKeys
} from '../utils/utils';

// GET /meetings
export const getAllMeetings = async (req, res) => {
    const meetings = await query(
        `SELECT * FROM meeting;`
    );

    const yms = await meetings.rows.map(async (meeting) => {
        const ym = await query(
            `SELECT meeting.* FROM meeting_yearly_meeting
            JOIN meeting ON meeting.id = meeting_yearly_meeting.yearly_meeting_id
            WHERE meeting_id = ${meeting.id};`
        );
        return meeting.yearly_meeting = ym.rows;
    });

    const branches = await meetings.rows.map(async (meeting) => {
        const branch = await query(
            `SELECT branch.* FROM meeting_branch
            JOIN branch ON branch.id = meeting_branch.branch_id
            WHERE meeting_id = ${meeting.id};`
        );
        return meeting.branch = branch.rows;
    });

    const worshipStyles = await meetings.rows.map(async (meeting) => {
        const ws = await query(
            `SELECT worship_style.* FROM meeting_worship_style
            JOIN worship_style ON worship_style.id = meeting_worship_style.worship_style_id
            WHERE meeting_id = ${meeting.id};`
        );
        return meeting.worship_style = ws.rows;
    });

    const accessibilities = await meetings.rows.map(async (meeting) => {
        const access = await query(
            `SELECT accessibility.* FROM meeting_accessibility
            JOIN accessibility ON accessibility.id = meeting_accessibility.accessibility_id
            WHERE meeting_id = ${meeting.id};`
        );
        return meeting.accessibility = access.rows;
    });

    Promise.all([
        Promise.all(yms),
        Promise.all(branches),
        Promise.all(worshipStyles),
        Promise.all(accessibilities)
    ]).then(() => {
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

    res.json({meetings: meetings.rows});
};

// GET /meetings/:id
export const getMeetingById = async (req, res) => {
    const meetingId = req.params.id;
    const meetings = await query(
        `SELECT * FROM meeting
        WHERE id = ${meetingId};`
    );

    // also add and return yearly_meeting, branch, worship_style, and accessibility

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
    const meetingId = meeting.rows[0].id;

    // Create meeting's yearly_meeting(s)
    const newMeetingYearlyMeetings = [];
    yearlyMeetingIds.forEach((ymId) => {
        newMeetingYearlyMeetings.push({
            meeting_id: meetingId,
            yearly_meeting_id: ymId
        });
    });
    newMeetingYearlyMeetings.forEach(async (mym, i) => {
        const mymQueryString = 'INSERT INTO meeting_yearly_meeting (' + getKeys(mym) + ') ' +
                        ' VALUES (' + getQueryBling(mym) + ')' + ';';
        await query(mymQueryString, getValues(mym));
    });

    // Create meeting's worship_style(s)
    const newMeetingWorshipStyles = [];
    worshipStyleIds.forEach((wsId) => {
        newMeetingWorshipStyles.push({
            worship_style_id: wsId,
            meeting_id: meetingId
        });
    });
    newMeetingWorshipStyles.forEach(async (mws, i) => {
        const mwsQueryString = 'INSERT INTO meeting_worship_style (' + getKeys(mws) + ') ' +
                        ' VALUES (' + getQueryBling(mws) + ')' + ';';
        await query(mwsQueryString, getValues(mws));
    });

    // Create new meeting's branch(es)
    const newMeetingBranches = [];
    branchIds.forEach((bId) => {
        newMeetingBranches.push({
            branch_id: bId,
            meeting_id: meetingId
        });
    });
    newMeetingBranches.forEach(async (mb, i) => {
        const mbQueryString = 'INSERT INTO meeting_branch (' + getKeys(mb) + ') ' +
                        ' VALUES (' + getQueryBling(mb) + ')' + ';';
        await query(mbQueryString, getValues(mb));
    });

    // Create new meeting's accessibility option(s)
    const newMeetingAccessibility = [];
    accessibilityIds.forEach((aId) => {
        newMeetingAccessibility.push({
            accessibility_id: aId,
            meeting_id: meetingId
        });
    });
    newMeetingAccessibility.forEach(async (ma, i) => {
        const maQueryString = 'INSERT INTO meeting_accessibility (' + getKeys(ma) + ') ' +
                        ' VALUES (' + getQueryBling(ma) + ')' + ';';
        await query(maQueryString, getValues(ma));
    });

    Promise.all([
        Promise.all(newMeetingYearlyMeetings),
        Promise.all(newMeetingWorshipStyles),
        Promise.all(newMeetingBranches),
        Promise.all(newMeetingAccessibility)
    ]).then(() => {
        res.status(201).send({meeting});
    });
};

// PUT /meetings/:id
export const updateMeeting = async (req, res) => {
    const meetingId = req.params.id;
    const meeting = req.body.meeting;
    const queryString = 'UPDATE meeting ' +
                        ' SET ' +
                        getKeyValueQueryString(meeting) +
                        ' WHERE id = ' + meetingId + ';';

    // We'll also need to be able to update yearly_meeting, worship_style, branch, & accessability

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

    // Also delete join tables for yearly_meeting, branch, worship_style, and accessibility

    res.json({meeting});
};
