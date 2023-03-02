const service = require('../services/metrics.service');
const constants = require('../constants/metrics.constant');

function middleware (req, res, next) {
    const requestStartDate = new Date();
    const requestStartTime = process.hrtime();

    let requestData, responseData, endingType, elapsedMs;

    req.on('finish', () => {
        elapsedMs = getMsElapsedUntilNow(requestStartTime);
        endingType = constants.endingTypes.FINISHED;

        requestData = processRequest(req);

        if(requestData && responseData) {
            saveMetric(endingType, requestStartDate, elapsedMs, requestData, responseData);
        }
    });

    req.on('close', () => {
        elapsedMs = getMsElapsedUntilNow(requestStartTime);
        endingType = constants.endingTypes.CLOSED;

        requestData = processRequest(req);

        if(requestData && responseData) {
            saveMetric(endingType, requestStartDate, elapsedMs, requestData, responseData);
        }
    });

    const resEnd = res.end;

    res.end = (...arguments) => {
        responseData = processResponse(res);

        if(requestData && responseData) {
            saveMetric(endingType, requestStartDate, elapsedMs, requestData, responseData);
        }
        
        resEnd.apply(res, arguments);
    };

    return next();
}

function processRequest(request) {
    const contentLength = parseInt(request.headers['content-length']);
    const remoteIp = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    delete request.headers['x-access-token'];
    delete request.headers['content-length'];
    delete request.headers['x-real-ip'];
    delete request.headers['x-forwarded-for'];

    let requestBody = (!request.body ||
        (request.body && 
            request.body.constructor === Object &&
            Object.keys(request.body).length === 0) ? null : request.body);

    if(requestBody) {
        const buffer = Buffer.from(JSON.stringify(requestBody));
        requestBody = buffer.toString('base64');
    }

    return {
        remote_ip: remoteIp,
        path: request.originalUrl,
        method: request.method,
        headers: request.headers,
        authenticated_user: request.authenticatedUser ? request.authenticatedUser.id : null,
        body: requestBody,
        size: requestBody ? contentLength : null
    };
}

function processResponse(response) {
    const headers = response.getHeaders();
    const contentLength = parseInt(headers['content-length']);
    
    delete headers['content-length'];

    return {
        status_code: response.statusCode,
        headers: headers,
        size: contentLength
    };
}

function saveMetric(endingType, startDate, elapsedMs, requestData, responseData) {
    let statusType = constants.statusTypes.ERROR;

    if(responseData.status_code === 200) {
        statusType = constants.statusTypes.OK;
    }
    if(responseData.status_code === 400) {
        statusType = constants.statusTypes.BAD_REQUEST;
    }
    else if(responseData.status_code === 401 || responseData.status_code === 403) {
        statusType = constants.statusTypes.UNAUTHORIZED;
    }
    else if(responseData.status_code === 404) {
        statusType = constants.statusTypes.NOT_FOUND;
    }

    service.createMetric({
        status: statusType,
        start_time: startDate,
        ending_reason: endingType,
        time_elapsed: elapsedMs,
        request: requestData,
        response: responseData
    });
}

function getMsElapsedUntilNow(start) {
    const diff = process.hrtime(start);

    return (diff[0] * constants.nanosecondsPerSecond +diff[1]) / constants.nanosecondsToMs;
}

module.exports = middleware;