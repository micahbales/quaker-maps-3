// Lets us use async/await without internal error handling
export const catchErrors = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};

// Use this to make a simple query to the database
export const query = async (client, queryString) => {
  // Returns a promise
  return await client.query(queryString);
};
