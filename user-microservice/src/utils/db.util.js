import db from "../models/index.js";
import logger from "./logger.util.js"


export default async function migrateDb() {
    db.sequelize
        .sync({ alter: true })
        .then(async () => {
            console.log("Database connected")
            logger.info("Database connected")
        })
        .catch((err) => {
            console.log("Unable to connect to the database: ", err)
            logger.error("Unable to connect to the database: ", err)
        });
}