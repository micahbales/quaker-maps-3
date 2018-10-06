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
