import {query} from '../utils/utils';

export const allMeetings = async (req, res) => {
    const meetings = await query(
        'SELECT * FROM meeting;'
    );

    res.json({meetings});
};

export const meetingById = async (req, res) => {
    const meetingId = req.params.id;
    const meetings = await query(
        'SELECT * FROM meeting ' +
        ' WHERE id = ' + meetingId + ';'
    );

    res.json({meetings});
};
