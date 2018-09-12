import {Client} from 'pg';

// Lets us use async/await without internal error handling
export const catchErrors = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};

// Use this to make a simple query to the database
export const query = async (queryString) => {
  const client = new Client();
  await client.connect();

  return await client.query(queryString).then((rows) => {
    // Clean up and return results
    client.end();
    return rows;
  });
};
