import {Client} from 'pg';
import {query} from '../utils/utils';

export const allMeetings = async (req, res) => {
    const client = new Client();
    await client.connect();

    const queryString = 'SELECT * FROM meeting;';
    const meetingRecords = await query(client, queryString);

    await client.end();

    res.json({allMeetings: meetingRecords});
};
