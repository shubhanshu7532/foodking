/**
 * Rider model
 * Represents a Rider entity in the database
 * @module models/Rider
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Rider
 * @class Rider
 */

"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Rider extends Model {
        static associate(models) {
            // associations
        }
    }
    Rider.init(
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
            ip: DataTypes.STRING,
            token: { type: DataTypes.STRING, defaultValue: null }, // jwt token for refresh token
            is_banned: { type: DataTypes.BOOLEAN, defaultValue: false },
            state: { type: DataTypes.STRING, allowNull: true },
            country: { type: DataTypes.STRING, allowNull: true },
            city: { type: DataTypes.STRING, allowNull: true },
            is_busy: { type: DataTypes.BOOLEAN, defaultValue: false },
            delivery_count: { type: DataTypes.INTEGER, allowNull: true },
            avgRating: { type: DataTypes.FLOAT, allowNull: true },
            totalRating: { type: DataTypes.FLOAT, allowNull: true },
            latitude: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            longitude: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            verified: { type: DataTypes.BOOLEAN, defaultValue: true },
            vehicle_no: { type: DataTypes.STRING, allowNull: true },
            coordinates: {
                type: DataTypes.GEOMETRY('POINT')
            },
        },
        {
            hooks: {
                afterCreate: async (user, options) => {
                },
                beforeDestroy: async (user, options) => {
                },
            },
            sequelize,
            modelName: "Rider",
            indexes: [{ unique: true, fields: ["phone", "username"] }],
        }
    );
    return Rider;
};
