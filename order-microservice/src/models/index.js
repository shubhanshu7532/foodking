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
import Order from "./order.model.js"
import CouponClaimed from "./coupon.claimed.model.js"
import Coupon from "./coupons.model.js"

// rummy imports 

const db = {}

const sequelize = new Sequelize(config)

// 2. Add imported models to the db object

db.Order = Order(sequelize, Sequelize.DataTypes)
db.Coupon = Coupon(sequelize, Sequelize.DataTypes)
db.CouponClaimed = CouponClaimed(sequelize, Sequelize.DataTypes)



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