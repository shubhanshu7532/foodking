/**
 * Database configuration and model initialization.
 * Imports and associates all the models with the Sequelize instance.
 * @module models/index
 * @requires sequelize
 * @requires sequelize/Model
 * @requires models/*
 * @exports db
 */

'use strict';

import Sequelize from 'sequelize'
import config from '../config/database.js'
import Rider from './rider.model.js'
import Otp from "./otp.model.js"

// rummy imports 

const db = {}

const sequelize = new Sequelize(config)

// 2. Add imported models to the db object

db.Rider = Rider(sequelize, Sequelize.DataTypes)
db.Otp = Otp(sequelize, Sequelize.DataTypes)



// Initialize models
const initializeModels = () => {
    console.log(`Imported ${Object.keys(db).length} models`)
    for (const modelName of Object.keys(db)) {
        console.log(`Associating ${modelName}`)
        if (db[modelName].associate) {
            db[modelName].associate(db)
        }
    }
};

initializeModels()

db.sequelize = sequelize
db.Sequelize = Sequelize
export default db