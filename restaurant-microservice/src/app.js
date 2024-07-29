/**
 * Main entry point for the foodking restaurant microservice API.
 * It sets up the Fastify server, registers plugins,
 * imports routes, and starts the server.
 * 
 * @file App.js
 * @module app
 * @category app
 * @subcategory main
 * @requires fastify
 */
import dotenv from 'dotenv'
dotenv.config() // load environment variables from .env file

import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import pino from 'pino'
import routes from './routes'
import microServiceRoutes from './microservice-routes'
import fastifyStatic from '@fastify/static'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import handleErrors from './utils/error-handler.util.js'
import jwtAuthPlugin from "./plugins/jwt-auth.plugin.js"
import RBAMPlugin from "./plugins/rbam.plugin.js"
import redisPlugin from './plugins/redis.plugin.js'
import multipart from '@fastify/multipart'
//import startCronJobs from './utils/cron'
import path from 'path'
import migrateDb from './utils/db.util.js'
import logger from './utils/logger.util.js'

process.env.TZ = "Asia/Kolkata" // set timezone
/** 
 * Create a rotating write stream for logging to files
 */


/**
 * Fastify server instance
 * @type {FastifyInstance}
 */
export const server = Fastify({
    logger
})



/**
 * Internal Logger
 * @type {pino.Logger}
 */
// export const logger = server.log

/**
 * Register custom error handler
 */
handleErrors(server)

/**
 * Multipart form data plugin (for file uploads)
 */
await server.register(multipart)

/**
 * Register cookie plugin
 */

await server.register(cookie, {
    secret: process.env.COOKIE_SECRETS.split(","), // array of keys to be used for cookies signature
})

/**
 * Register redis caching plugin
 */
await server.register(redisPlugin)

// await server.register(fastifyJwt, {
//     secret: 'hereismysecretkey'
// })

/** 
 * Setup static/public directory
 */
await server.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/public/',
    // constraints: { host: 'example.com' } // optional: default {}
})

/**
 * Register rate-limit plugin
 * Limit requests to the server by IP address. We'll also set request limit on server level. This will limit the number of requests to the server from a single IP address. This is useful to prevent brute-force/DDOS attacks.
 * @see https://github.com/fastify/fastify-rate-limit
 */
// await server.register(rateLimit, {
//     max: 100, // max requests per windowMs
//     timeWindow: '1 minute', // windowMs: milliseconds - how long to keep records of requests in memory
//     cache: 10000, // number of max entries in the global cache
//     // allowList: ['127.0.0.1'], // default []
//     nameSpace: 'play999-api-ratelimit-', // default is 'fastify-rate-limit-'
//     // keyGenerator: function (request) { /* ... */ }, // default (request) => request.raw.ip. TODO: make sure user's ip is accessible behind nginx proxy, if not then use request.headers['x-forwarded-for'] || request.ip
// })

/**
 * Register swagger plugin
 */
await server.register(swagger)

await server.register(swaggerUi, {
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'Food king user microservice docs Documentation',
            description: 'Food king user-microservice API Documentation',
            version: '0.1.0',
            termsOfService: 'https://example.com/tos',
            contact: {
                name: 'John Doe',
                url: 'https://www.example.com',
                email: 'john.doe@email.com'
            }
        },
        externalDocs: {
            url: 'https://www.example.com/api/',
            description: 'Find more info here'
        },
        host: '127.0.0.1:3000',
        basePath: '',
        schemes: ['http', 'https'],
    },
    uiConfig: {
        docExpansion: 'list', // expand/not all the documentations none|list|full
        deepLinking: false
    },
    uiHooks: {
        onRequest: function (request, reply, next) {
            next()
        },
        preHandler: function (request, reply, next) {
            next()
        }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true
})

/**
 * Register JWT middleware
 */
await server.register(jwtAuthPlugin)

/**
 * Register RBAM (Role-Based Access Management) middleware
 */
await server.register(RBAMPlugin)

/**
 * Register server-cors plugin
 */
await server.register(cors, {
    // TODO: Setup CORS options before deploying to production
    // origin: 'https://example.com', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified HTTP methods
    // allowedHeaders: ['Content-Type'], // Allow specified request headers
    // exposedHeaders: ['Content-Length'], // Expose specified response headers
    // credentials: true, // Enable sending credentials (cookies, HTTP authentication) in cross-origin requests
    // preflightContinue: false, // Disable handling of preflight requests
    // optionsSuccessStatus: 204 // Set the response status code for successful OPTIONS requests
})

/**
 * Register routes
 */
await server.get('/', async (request, reply) => {
    const state_code = request.headers['X-State-Code'] || 'Unknown';
    // Use state code in your application logic
    console.log(`Client's State Code: ${state_code}`);
    return reply.send({
        message: 'Hello world user service.',
        environment: process.env.NODE_ENV,
    })
}) // root route

// await server.get('/download', async (request, reply) => {
//     const userAgent = request.headers['user-agent'];
//     // Check if the user-agent contains "Android" or "iPhone" to determine the device type.
//     if (userAgent.includes('Android')) {
//         // Redirect to the Google Play Store for Android devices.
//         // reply.redirect('https://play.google.com/store/apps/details?id=com.jumborummy');
//         // reply.redirect('https://play.google.com/store/apps/details?id');  // will use original redirect url
//     } else if (userAgent.includes('iPhone')) {
//         // Redirect to the Apple App Store for iOS devices.
//         // reply.redirect('https://apps.apple.com/us/app/ludo king');
//         reply.redirect('https://apps.apple.com/us/app/your-app-name/idyour-app-id');  // will use original redirect url
//     } else {
//         // Handle other devices or unknown user-agents.
//         reply.code(400).send('Unsupported device');
//     }
// })
/**
 * 
 * Register api/v1 routes
 */
await server.register(routes, { prefix: "/api/v1" })
await server.register(microServiceRoutes, { prefix: "/restaurant/microservice" })

/**
 * Connect to the database
 */
migrateDb()

/** 
 * Handle uncaught exceptions and unhandled promise rejections 
 */
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    logger.error(`Error: ${err.message}`)
    server.close(() => process.exit(1)); // close server & exit process: mandatory (as per the Node.js docs)
})

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`)
    logger.error(`Error: ${err.message}`)
    server.close(() => process.exit(1))
})


// console.log all server routes
// server.ready((err) => {
//     if (err) throw err
//     console.log(server.printRoutes())
// })

/** 
 * Run the server! 
 */
const start = async () => {
    try {
        server.listen({
            port: process.env.APP_PORT || 3000,
            host: process.env.APP_HOST || "127.0.0.1",
        })
    } catch (err) {
        logger.error(`server error: ${err}`)
        process.exit(1)
    }
}

start()

/**
 * Run swagger!
 */
server.ready(err => {
    if (err) throw err
    server.swagger()
})

/**
 * Run cron jobs!
 */
// TODO: UNCOMMENT THIS CRON JOBS


//startCronJobs()


