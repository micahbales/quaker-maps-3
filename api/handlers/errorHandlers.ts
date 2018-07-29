// Lets us use async/await without internal error handling
export const catchErrors = (fn) => {
    return (req, res, next) => {
      return fn(req, res, next).catch(next);
    };
  };
