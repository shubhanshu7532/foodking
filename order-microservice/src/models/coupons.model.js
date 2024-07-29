/**
 * Coupon model
 * Represents a Coupon entity in the database
 * @module models/Coupon
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Coupon
 * @class Coupon
 */

"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Coupon extends Model {
        static associate(models) {
            // associations
            Coupon.hasMany(models.CouponClaimed, {
                foreignKey: "coupon_id",
                as: "claims",
            });
        }
    }
    Coupon.init(
        {

            restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
            coupon_code: { type: DataTypes.STRING, allowNull: false, unique: true },
            percentage: { type: DataTypes.INTEGER },
            max_credit: { type: DataTypes.INTEGER },
            valid_till: { type: DataTypes.DATE }
        },
        {
            hooks: {
                afterCreate: async (user, options) => {
                },
                beforeDestroy: async (user, options) => {
                },
            },
            timestamps: true,
            sequelize,
            modelName: "Coupon",
        }
    );
    return Coupon;
};
