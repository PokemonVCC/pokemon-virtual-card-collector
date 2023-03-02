const constants = require('../constants/metrics.constant');

function middleware (req, res, next) {
    const requestStartDate = new Date();
    const requestStartTime = process.hrtime();
    let responseMetric;

    req.on('finish', () => {
        processRequest(constants.endingTypes.FINISHED, requestStartDate, requestStartTime, req, responseMetric);
    });

    req.on('close', () => {
        processRequest(constants.endingTypes.CLOSED, requestStartDate, requestStartTime, req, responseMetric);
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
        responseMetric = processResponse(res, responseBody);
        
        resEnd.apply(res, arguments);
    };

    return next();
}

function processRequest(endingType, startDate, startTime, request, responseMetric) {
    const msElapsed = getMsElapsedUntilNow(startTime);
    
    const requestHeaders = request.headers;
    delete requestHeaders['x-access-token'];

    const requestBody = (!request.body ||
        (request.body && 
            request.body.constructor === Object &&
            Object.keys(request.body).length === 0) ? null : request.body);

    const metric = {
        ending_reason: endingType,
        time_elapsed: msElapsed,
        remote_ip: request.headers['x-forwarded-for'] || request.socket.remoteAddress,
        authenticated_user: request.authenticatedUser ? request.authenticatedUser.id : null,
        request: {
            start: startDate,
            path: request.originalUrl,
            method: request.method,
            headers: requestHeaders,
            body: JSON.stringify(requestBody),
            size: requestBody ? parseInt(request.headers['content-length']) : null
        },
        response: responseMetric
    };

    console.log(metric);
}

function processResponse(response, responseBody) {
    const headers = response.getHeaders();

    return {
        status_code: response.statusCode,
        headers: headers,
        body: responseBody,
        size: parseInt(headers['content-length'])
    };
}

function getMsElapsedUntilNow(start) {
    const diff = process.hrtime(start);

    return (diff[0] * constants.nanosecondsPerSecond +diff[1]) / constants.nanosecondsToMs;
}

module.exports = middleware;