// Lets us use async/await without internal error handling
exports.catchErrors = function (fn) {
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};
//# sourceMappingURL=errorHandlers.js.map