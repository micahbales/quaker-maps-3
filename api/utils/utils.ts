import {Client} from 'pg';

// Lets us use async/await without internal error handling
export const catchErrors = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};

// Make a simple query to the database
export const query = async (queryString, values?) => {
  const client = new Client();
  await client.connect();

  return await client.query(queryString, values).then((rows) => {
    // Clean up and return results
    client.end();
    return rows;
  });
};

// Get keys for SQL queries
export function getKeys(record) {
  return Object.keys(record).join(',');
}

// Get values for SQL queries
export function getValues(record) {
  return Object.values(record);
}

// Get place holders for values in query strings
export function getQueryBling(record) {
  return Object.values(record)
          .map((value, i) => `$${i + 1}`)
          .join(',');
}

// Create key/value string for queries
export function getKeyValueQueryString(record) {
  let queryString = '';

  for (const key in record) {
    if (record.hasOwnProperty(key)) {
      queryString += `${key}=\'${record[key]}\',`;
    }
  }
  return queryString
          // Remove last comma
          .substring(0, queryString.length - 1);
}

// Remove join table values from record object
export function removeJoinKeys(record) {
  const keysToBeRemoved = ['yearly_meeting', 'worship_style', 'branch', 'accessibility'];
  // Make a shallow copy so we don't mutate the original record
  const newRecord = Object.assign({}, record);

  for (const key in newRecord) {
    if (newRecord.hasOwnProperty(key)) {
      if (keysToBeRemoved.includes(key)) delete newRecord[key];
    }
  }

  return newRecord;
}

export async function getMeetingAttributeRecords(meetings) {
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

  const promise = new Promise((resolve, reject) => {
    Promise.all([
      Promise.all(yms),
      Promise.all(branches),
      Promise.all(worshipStyles),
      Promise.all(accessibilities)
    ]).then((data) => {
        resolve();
      });
  });

  return promise;
}

export async function createMeetingAttributeRecords(meeting, meetingId) {
  const yearlyMeetingIds: number[] = meeting.yearly_meeting;
  const worshipStyleIds: number[] = meeting.worship_style;
  const branchIds: number[] = meeting.branch;
  const accessibilityIds: number [] = meeting.accessibility;
  let yms;
  let branches;
  let worshipStyles;
  let accessibilities;

  // Create meeting's yearly_meeting(s)
  if (yearlyMeetingIds) {
    const newMeetingYearlyMeetings = [];
    yearlyMeetingIds.forEach((ymId) => {
        newMeetingYearlyMeetings.push({
            meeting_id: meetingId,
            yearly_meeting_id: ymId
        });
    });
    yms = newMeetingYearlyMeetings.map(async (mym, i) => {
        const mymQueryString = 'INSERT INTO meeting_yearly_meeting (' + getKeys(mym) + ') ' +
                        ' VALUES (' + getQueryBling(mym) + ')' + ';';
        return await query(mymQueryString, getValues(mym));
    });
  } else {
    yms = null;
  }

  // Create meeting's worship_style(s)
  if (worshipStyleIds) {
    const newMeetingWorshipStyles = [];
    worshipStyleIds.forEach((wsId) => {
        newMeetingWorshipStyles.push({
            worship_style_id: wsId,
            meeting_id: meetingId
        });
    });
    worshipStyles = newMeetingWorshipStyles.map(async (mws, i) => {
        const mwsQueryString = 'INSERT INTO meeting_worship_style (' + getKeys(mws) + ') ' +
                        ' VALUES (' + getQueryBling(mws) + ')' + ';';
        return await query(mwsQueryString, getValues(mws));
    });
  } else {
    worshipStyles = null;
  }

  // Create new meeting's branch(es)
  if (branchIds) {
    const newMeetingBranches = [];
    branchIds.forEach((bId) => {
        newMeetingBranches.push({
            branch_id: bId,
            meeting_id: meetingId
        });
    });
    branches = newMeetingBranches.map(async (mb, i) => {
        const mbQueryString = 'INSERT INTO meeting_branch (' + getKeys(mb) + ') ' +
                        ' VALUES (' + getQueryBling(mb) + ')' + ';';
        return await query(mbQueryString, getValues(mb));
    });
  } else {
    branches = null;
  }

  // Create new meeting's accessibility option(s)
  if (accessibilityIds) {
    const newMeetingAccessibility = [];
    accessibilityIds.forEach((aId) => {
        newMeetingAccessibility.push({
            accessibility_id: aId,
            meeting_id: meetingId
        });
    });
    accessibilities = newMeetingAccessibility.map(async (ma, i) => {
        const maQueryString = 'INSERT INTO meeting_accessibility (' + getKeys(ma) + ') ' +
                        ' VALUES (' + getQueryBling(ma) + ')' + ';';
        return await query(maQueryString, getValues(ma));
    });
  } else {
    accessibilities = null;
  }

  const promise = new Promise((resolve, reject) => {
    Promise.all([
      yms ? Promise.all(yms) : yms,
      branches ? Promise.all(branches) : branches,
      worshipStyles ? Promise.all(worshipStyles) : worshipStyles,
      accessibilities ? Promise.all(accessibilities) : accessibilities
    ]).then((data) => {
        resolve();
      });
  });

  return promise;
}
