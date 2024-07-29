/**
 * Restaurant model
 * Represents a Restaurant entity in the database
 * @module models/Restaurant
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Restaurant
 * @class Restaurant
 */

"use strict";
import { Model } from "sequelize";
// import fs from "fs";

export default (sequelize, DataTypes) => {
    class Restaurant extends Model {
        static associate(models) {
            // associations
            Restaurant.hasMany(models.Menu, {
                foreignKey: 'restaurant_id',
                as: 'menus'
            });
        }
    }
    Restaurant.init(
        {
            //username unique. phone unique.
            phone: {
                type: DataTypes.STRING,
                allowNull: true, // phone required for customers and partners/players but not for admins, validated in controller
                unique: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
                validate: {
                    is: /^[a-zA-Z0-9_]+$/, // <-- regex for alphanumeric and underscore
                },
            },
            // name: DataTypes.STRING,
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            restaurant_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ip: DataTypes.STRING,
            token: { type: DataTypes.STRING, defaultValue: null }, // jwt token for refresh token
            is_banned: { type: DataTypes.BOOLEAN, defaultValue: false },
            state: { type: DataTypes.STRING, allowNull: true },
            country: { type: DataTypes.STRING, allowNull: true },
            city: { type: DataTypes.STRING, allowNull: true },
            restaurant_address: { type: DataTypes.STRING, allowNull: true },
            totalRating: { type: DataTypes.FLOAT, allowNull: true },
            avgRating: { type: DataTypes.FLOAT, allowNull: true },
            avgTime: { type: DataTypes.FLOAT, allowNull: true },
            totalTime: { type: DataTypes.FLOAT, allowNull: true },
            successDeliveryCount: { type: DataTypes.INTEGER, allowNull: true },
            latitude: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            longitude: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            verified: { type: DataTypes.BOOLEAN, defaultValue: true },
            category: {
                type: DataTypes.ENUM,
                values: ['Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Japanese', 'North Indian', 'Mughlai'],
                allowNull: true
            },
            coordinates: {
                type: DataTypes.GEOMETRY('POINT')
            }
        },
        {
            hooks: {
                afterCreate: async (user, options) => {
                },
                beforeDestroy: async (user, options) => {
                },
            },
            sequelize,
            modelName: "Restaurant",
            indexes: [{ unique: true, fields: ["phone", "username"] }],
        }
    );
    return Restaurant;
};
