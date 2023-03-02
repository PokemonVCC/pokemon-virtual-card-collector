const service = require('../services/metrics.service');
const constants = require('../constants/metrics.constant');

function middleware (req, res, next) {
    const metric = {};
    const requestStartDate = new Date();
    const requestStartTime = process.hrtime();
    let endingType;

    req.on('finish', () => {
        endingType = constants.endingTypes.FINISHED;

        metric.request = processRequest(req);

        if(metric.request && metric.response) {
            saveMetric(metric, endingType, requestStartDate, requestStartTime);
        }
    });

    req.on('close', () => {
        endingType = constants.endingTypes.CLOSED;

        metric.request = processRequest(req);

        if(metric.request && metric.response) {
            saveMetric(metric, endingType, requestStartDate, requestStartTime);
        }
    });

    const resEnd = res.end;
    const resWrite = res.write;
    const chunks = [];

    res.write = (...arguments) => {
        chunks.push(Buffer.from(arguments[0]));
        resWrite.apply(res, arguments);
    };

    res.end = (...arguments) => {
        if(arguments[0]) {
            chunks.push(Buffer.from(arguments[0]));
        }
        
        const responseBody = Buffer.concat(chunks).toString('utf8');
        metric.response = processResponse(res, responseBody);

        if(metric.request && metric.response) {
            saveMetric(metric, endingType, requestStartDate, requestStartTime);
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

function processResponse(response, responseBody) {
    const buffer = Buffer.from(responseBody);
    
    const headers = response.getHeaders();
    const contentLength = parseInt(headers['content-length']);
    
    delete headers['content-length'];

    return {
        status_code: response.statusCode,
        headers: headers,
        body: buffer.toString('base64'),
        size: contentLength
    };
}

function saveMetric(metric, endingType, startDate, startTime) {
    const msElapsed = getMsElapsedUntilNow(startTime);

    metric.start_time = startDate;
    metric.ending_reason = endingType;
    metric.time_elapsed = msElapsed;

    service.createMetric(metric);
}

function getMsElapsedUntilNow(start) {
    const diff = process.hrtime(start);

    return (diff[0] * constants.nanosecondsPerSecond +diff[1]) / constants.nanosecondsToMs;
}

module.exports = middleware;