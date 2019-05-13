import { Meeting } from '../../client/src/Definitions';
import { createMultiOptionRecords } from './utils/createMultiOptionRecords';
import { transformMeetingRecord } from './utils/transformMeetingRecord';
import { asyncForEach } from './utils/asyncForEach';
import * as fs from 'fs';
import * as util from 'util';
import * as originalMeetings from '../originalMeetingsData.json';
import * as accessibilities from '../insertDevelopmentData/data/accessibility.json';
import * as meetingAccessibilities from '../insertDevelopmentData/data/meeting_accessibility.json';
import * as branches from '../insertDevelopmentData/data/branch.json';
import * as meetingBranches from '../insertDevelopmentData/data/meeting_branch.json';
import * as worshipStyles from '../insertDevelopmentData/data/worship_style.json';
import * as meetingWorshipStyles from '../insertDevelopmentData/data/meeting_worship_style.json';
import * as yearlyMeetings from '../insertDevelopmentData/data/yearly_meeting.json';
import * as meetingYearlyMeetings from '../insertDevelopmentData/data/meeting_yearly_meeting.json';
const writeFile = util.promisify(fs.writeFile);

const transformJsonData = async () => {
    const strippedMeetings = [];

    try {
        await asyncForEach(originalMeetings, async (meeting: Meeting) => {
            // Create tables and join tables for accessibility, branch, worship_style, and yearly_meeting
            await createMultiOptionRecords(
                meeting,
                accessibilities,
                meetingAccessibilities,
                'accessibility',
                'meeting_accessibility'
            );
            await createMultiOptionRecords(
                meeting,
                branches,
                meetingBranches,
                'branch',
                'meeting_branch'
            );
            await createMultiOptionRecords(
                meeting,
                worshipStyles,
                meetingWorshipStyles,
                'worship_style',
                'meeting_worship_style'
            );
            await createMultiOptionRecords(
                meeting,
                yearlyMeetings,
                meetingYearlyMeetings,
                'yearly_meeting',
                'meeting_yearly_meeting'
            );

            // Strip multi option field from each meeting
            const strippedMeeting = await transformMeetingRecord(meeting);
            strippedMeetings.push(strippedMeeting);
        });

        // Once we've stripped out all our multi option fields, save meetings and exit
        Promise.all(strippedMeetings)
            .then(() => writeFile(
                `../insertDevelopmentData/data/meetings.json`,
                JSON.stringify(strippedMeetings, null, 4),
                (err) => {
                    if (err) console.error(err);
                }
            ));
    } catch (err) {
        console.error(err);
    }
};

transformJsonData();
