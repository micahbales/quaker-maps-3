import dotenv = require ('dotenv');
dotenv.config();
import {Pool, Client} from 'pg';
import sampleMeetings = require('./sampleMeetings.json');
import sampleMeetingYearlyMeetings = require('./sampleMeetingYearlyMeetings');
const pool = new Pool();

async function insertTestData(records) {
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

