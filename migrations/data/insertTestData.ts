import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../../.env'});
import {Pool, Client} from 'pg';

import * as sampleMeetings from './sampleMeetings.json';
import * as sampleMeetingYearlyMeetings from './sampleMeetingYearlyMeetings.json';
import * as sampleBranches from './sampleBranches.json';
import * as sampleMeetingBranches from './sampleMeetingBranches.json';
import * as sampleWorshipStyles from './sampleWorshipStyles.json';
import * as sampleMeetingWorshipStyles from './sampleMeetingWorshipStyles.json';
import * as sampleAccessibility from './sampleAccessibility.json';
import * as sampleMeetingAccessibility from './sampleMeetingAccessibility.json';
import * as sampleQuakers from './sampleQuakers.json';
import * as sampleMeetingQuakers from './sampleMeetingQuakers.json';

async function insertTestData(records) {
    const pool = new Pool();

    for (const record of records) {
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

        console.log(queryString);
        await pool.query(queryString)
        .catch((err) => { console.error('query error: ', err); });
    }

    await pool.end();
}

insertTestData(sampleMeetings);
insertTestData(sampleMeetingYearlyMeetings);
insertTestData(sampleBranches);
insertTestData(sampleMeetingBranches);
insertTestData(sampleWorshipStyles);
insertTestData(sampleMeetingWorshipStyles);
insertTestData(sampleAccessibility);
insertTestData(sampleMeetingAccessibility);
insertTestData(sampleQuakers);
insertTestData(sampleMeetingQuakers);
