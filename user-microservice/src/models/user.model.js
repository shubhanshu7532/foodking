/**
 * User model
 * Represents a User entity in the database
 * @module models/user
 * @requires sequelize
 * @requires sequelize/Model
 * @exports User
 * @class User
 */

"use strict";
import { Model } from "sequelize";
// import fs from "fs";

export default (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // associations
        }
    }
    User.init(
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
            role: {
                type: DataTypes.ENUM,
                values: ["user", "admin"],
                allowNull: false,
                defaultValue: "user"
            },
            user_agent: { type: DataTypes.STRING, defaultValue: null },
            token: { type: DataTypes.STRING, defaultValue: null }, // jwt token for refresh token
            access: { type: DataTypes.JSON, defaultValue: null },// access control for admin (admin can give access to other admins for different sections)
            is_banned: { type: DataTypes.BOOLEAN, defaultValue: false },
            is_superuser: { type: DataTypes.BOOLEAN, defaultValue: false }, // for admins. first admin will be superuser and can create other admins, superuser can't be deleted or updated by other admins
            state: { type: DataTypes.STRING, allowNull: true },
            country: { type: DataTypes.STRING, allowNull: true },
            city: { type: DataTypes.STRING, allowNull: true },
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
            modelName: "User",
            indexes: [{ unique: true, fields: ["phone", "username"] }],
        }
    );
    return User;
};
