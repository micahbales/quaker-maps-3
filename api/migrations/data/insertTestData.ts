import dotenv = require ('dotenv');
dotenv.config();
import {Pool, Client} from 'pg';

import sampleMeetings = require('./sampleMeetings');
import sampleMeetingYearlyMeetings = require('./sampleMeetingYearlyMeetings');
import sampleBranches = require('./sampleBranches');
import sampleMeetingBranches = require('./sampleMeetingBranches');
import sampleWorshipStyles = require('./sampleWorshipStyles');
import sampleMeetingWorshipStyles = require('./sampleMeetingWorshipStyles');
import sampleAccessibility = require('./sampleAccessibility');
import sampleMeetingAccessibility = require('./sampleMeetingAccessibility');
import sampleQuakers = require('./sampleQuakers');
import sampleMeetingQuakers = require('./sampleMeetingQuakers');

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
            const strippedValue: string | number = value.replace(/'/g, '');
            return isNaN(strippedValue) ? value : Number(strippedValue);
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
