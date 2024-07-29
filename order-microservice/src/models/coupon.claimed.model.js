/**
 * CouponClaimed model
 * Represents a CouponClaimed entity in the database
 * @module models/CouponClaimed
 * @requires sequelize
 * @requires sequelize/Model
 * @exports CouponClaimed
 * @class CouponClaimed
 */

"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class CouponClaimed extends Model {
        static associate(models) {
            // associations
            CouponClaimed.belongsTo(models.Coupon, {
                foreignKey: "coupon_id",
                as: "coupon",
            });
        }
    }
    CouponClaimed.init(
        {

            coupon_id: { type: DataTypes.INTEGER },
            user_id: { type: DataTypes.DATE }
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
            modelName: "CouponClaimed",
        }
    );
    return CouponClaimed;
};
