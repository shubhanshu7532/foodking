import { CronJob } from "cron";
//updates
import logger from '../logger.util.js'
/**
 * Every 30 seconds cron job
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every30SecondsCronJob = new CronJob("*/30 * * * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every30SecondsCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata");

/**
 * Every 1 min cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every1MinCronJob = new CronJob("0 */1 * * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every1MinCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")
/**
 * Every 2 min cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every2MinCronJob = new CronJob("0 */2 * * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every1MinCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")

/**
 * Every 5 min cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every5MinCronJob = new CronJob("0 */5 * * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every5MinCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")
/**
 * Every 10 min cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every10MinCronJob = new CronJob("0 */10 * * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every10MinCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")

/**
 * Every 15 min cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every15MinCronJob = new CronJob("0 */15 * * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every10MinCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")
/**
 * Every 30 mins cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every30MinCronJob = new CronJob("0 */30 * * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every30MinCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")

/**
 * Every 1 hour cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every1HourCronJob = new CronJob("0 0 */1 * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every1HourCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")

/**
 * Every 3 hour cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every3HourCronJob = new CronJob("0 0 */3 * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every3HourCronJob ${err}`)
    }
}, null, true, "Asia/Kolkata")


/**
 * Every 6 hour cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every6HourCronJob = new CronJob("0 0 */6 * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every6HourCronJob ${err}`)
    }
}, null, true, "Asia/Kolkata")

/**
 * Every 12 hour cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every12HourCronJob = new CronJob("0 0 */12 * * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every12HourCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")

/**
 * Every 1 day cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every1DayCronJob = new CronJob("0 0 0 */1 * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every1DayCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")

/**
 * Every 1 week cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every1WeekCronJob = new CronJob("0 0 0 * * 0", async () => {
    try {
    } catch (err) {
        logger.error(`Every1WeekCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")

/**
 * Every 1 Month cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every1MonthCronJob = new CronJob("0 0 0 1 * *", async () => {
    try {
    } catch (err) {
        logger.error(`Every1MonthCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")

/**
 * Every 3 month cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every3MonthCronJob = new CronJob("0 0 0 1 */3 *", async () => {
    try {
    } catch (err) {
        logger.error(`Every3MonthCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")

// export all cron jobs
export default () => {
    Every30SecondsCronJob;
    Every1MinCronJob;
    Every2MinCronJob;
    Every5MinCronJob;
    Every10MinCronJob;
    Every15MinCronJob;
    Every30MinCronJob;
    Every1HourCronJob;
    Every3HourCronJob;
    Every6HourCronJob;
    Every12HourCronJob;
    Every1DayCronJob;
    Every1WeekCronJob;
    Every1MonthCronJob;
    Every3MonthCronJob;
};
