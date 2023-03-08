const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const app = express();
const db = require('./src/services/db.service');
const config = require('./src/configs/general.config');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

db.connect()
    .then(_ => {
        const extractionOp = require('./src/core/extraction.core');
        const syncOp = require('./src/core/sync.core');

        const extractionJob = schedule
            .scheduleJob({hour: 13, minute: 21, second: 45}, async () => {
                await extractionOp();
                await syncOp();
            });

        process.on('SIGINT', () => { 
            extractionJob.cancel();
            schedule.gracefulShutdown()
                .then(() => process.exit(0));
        });

        const logMiddleware = require('./src/middlewares/log.middleware');
        const errorMiddleware = require('./src/middlewares/error.middleware');

        const authRouter = require('./src/routes/auth.route');
        const cardRouter = require('./src/routes/card.route');
        const userRouter = require('./src/routes/user.route');
        const withdrawRouter = require('./src/routes/withdraw.route');

        app.use(logMiddleware);

        app.use('/auth', authRouter);
        app.use('/card', cardRouter);
        app.use('/user', userRouter);
        app.use('/withdraw', withdrawRouter);

        app.use(errorMiddleware);

        app.listen(config.port, '0.0.0.0', () => {
            console.log('Listening at http://localhost:' + config.port);
        })
    })
    .catch(err => { 
        console.error(err);
        process.exit(1);
    });