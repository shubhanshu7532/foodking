/**
 * Menu model
 * Represents a Menu entity in the database
 * @module models/Menu
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Menu
 * @class Menu
 */

"use strict";
import { Model } from "sequelize";
// import fs from "fs";

export default (sequelize, DataTypes) => {
    class Menu extends Model {
        static associate(models) {
            // associations
            Menu.belongsTo(models.Restaurant, {
                foreignKey: 'restaurant_id',
                as: 'restaurant'
            });
        }
    }
    Menu.init(
        {
            //username unique. phone unique.
            restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
            food_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER, allowNull: true
            },
            food_rating: {
                type: DataTypes.INTEGER, allowNull: true
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
            modelName: "Menu"
        }
    );
    return Menu;
};
