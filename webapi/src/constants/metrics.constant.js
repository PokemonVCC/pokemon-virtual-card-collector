const nanosecondsPerSecond = 1e9;
const nanosecondsToMs = 1e6;

const endingTypes = {
    FINISHED: 'FINISHED',
    CLOSED: 'CLOSED'
};

const statusTypes = {
    OK: 'OK',
    BAD_REQUEST: 'BAD REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    NOT_FOUND: 'NOT FOUND',
    ERROR: 'ERROR'
};

module.exports = {
    endingTypes,
    nanosecondsPerSecond,
    nanosecondsToMs,
    statusTypes
};