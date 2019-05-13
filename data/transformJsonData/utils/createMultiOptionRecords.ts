import { Meeting } from '../../../client/src/Definitions'
import * as fs from 'fs';
import * as util from 'util';
const writeFile = util.promisify(fs.writeFile);

const createNewTableRecord = async (tables, s, tableName) => {
    // Check to see if an string record exists with title of the meeting's string
    const tableRecord = tables.find((a) => {
        return a.title && a.title.trim() === s;
    });
    // If not, create it
    if (!tableRecord) {
        tables.push({
            id: tables.length + 1,
            title: s.trim(),
            table_type: tableName
        });
        await writeFile(
            `../insertDevelopmentData/data/${tableName}.json`,
            JSON.stringify(tables, null, 4),
            (err) => {
                if (err) console.error(err);
            }
        );
    }
};

const createNewJoinTable = async (meeting, tables, s, tableName, joinTables, joinTableName) => {
    const joinTableRecord = joinTables.find((j) => j.meeting_id === meeting.id);
    if (!joinTableRecord) {
        // Create a new join table
        const table = await tables.find((t) => t.title.trim() === s);
        const id = table.id ? table.id : null;
        if (id) {
            joinTables.push({
                meeting_id: meeting.id,
                [`${tableName}_id`]: id,
                table_type: joinTableName
            });
            await writeFile(
                `../insertDevelopmentData/data/${joinTableName}.json`,
                JSON.stringify(joinTables, null, 4),
                (err) => {
                    if (err) console.error(err);
                }
            );
        }
    }
};

export const createMultiOptionRecords = async (
    meeting: Meeting,
    tables,
    joinTables,
    tableName,
    joinTableName
) => {
    if (!meeting[tableName]) return;
    // Get one or more tables
    const tableStrings = meeting[tableName].trim().split(',');

    // For each table of this type that the meeting has...
    await tableStrings.forEach(async (s: string) => {
        await createNewTableRecord(tables, s, tableName);
        await createNewJoinTable(meeting, tables, s, tableName, joinTables, joinTableName);
    });
};
