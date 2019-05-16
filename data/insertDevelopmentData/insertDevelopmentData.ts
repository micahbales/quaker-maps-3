import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../../.env'});
import {Pool} from 'pg';
const pool = new Pool();
// Handle client errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

import * as meetings from './data/meetings.json';
import * as meetingYearlyMeetings from './data/meeting_yearly_meeting.json';
import * as branches from './data/branch.json';
import * as meetingBranches from './data/meeting_branch.json';
import * as worshipStyles from './data/worship_style.json';
import * as meetingWorshipStyles from './data/meeting_worship_style.json';
import * as accessibility from './data/accessibility.json';
import * as meetingAccessibility from './data/meeting_accessibility.json';

async function insertTestData(records) {
    for (const record of records) {
        // await new Promise((resolve, reject) => setTimeout(() => resolve(), 100));
        const client = await pool.connect();
        // Get table_type, then remove it from the record
        const tableType = record.table_type;
        delete record.table_type;

        // Get keys and values for the record to be inserted
        const recordKeys: string = Object.keys(record).join(',');
        const recordValues: string = Object.values(record).map((value) => `\'${value}\'`)
            .map((value: string) => {
                // Strings should be in quotes, numbers should not
                const strippedValue: string | number = value.replace(/'/g, '');
                return Number.isNaN(Number(strippedValue)) ? value : Number(strippedValue);
            }).join(',');

        const queryString = `INSERT INTO ${tableType} (${recordKeys}) VALUES(${recordValues});`;

        try {
            await client.query(queryString);
            console.log(queryString);
        } catch (err) {
            console.error(err);
        } finally {
            client.release();
        }
    }
}

insertTestData(meetings);
insertTestData(meetingYearlyMeetings);
insertTestData(branches);
insertTestData(meetingBranches);
insertTestData(worshipStyles);
insertTestData(meetingWorshipStyles);
insertTestData(accessibility);
insertTestData(meetingAccessibility);
