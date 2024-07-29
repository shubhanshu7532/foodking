/**
 * Queue module
 * @module Queue
 * @category utils
 * @subcategory queue
 * @requires bullmq
 * @see https://docs.bullmq.io/guide/queues
 */

import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import logger from '../logger.util.js'

const REDIS_URL = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`

const connection = new Redis(REDIS_URL);

// Create a single queue
const queue = new Queue('queue', { connection });

// Create a worker to process jobs from the queue
const worker = new Worker('queue', async (job) => {
    console.log("queue ke andar", job)
    switch (job.name) {
        // case 'user-signup':
        // default:
        //     break;
    }
}, { connection });

worker.on('error', (job, err) => {
    logger.error(`Job failed with ID: ${job.id}`);
    logger.error(`Error: ${err.message}`);
    logger.error(`Stack: ${err.stack}`);
    logger.error(`Job data: ${JSON.stringify(job.data)}`);
    console.error(`Job failed with ID: ${job.id}`);
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    console.error(`Job data: ${JSON.stringify(job.data)}`);
});

// Listen for completed jobs
worker.on('completed', (job) => {
    logger.info(`Job completed with result: ${job.returnvalue}`);
    console.log(`Job completed with result: ${job.returnvalue}`);
});
// Listen for errors
queue.on('error', (error) => {
    logger.error(`Queue error: ${error}`);
    console.error(`Queue error: ${error}`);
});

// Listen for completed jobs
queue.on('completed', (job) => {
    logger.info(`Job completed with result ${job.returnvalue}`);
    console.log(`Job completed with result ${job.returnvalue}`);
});

export default queue;