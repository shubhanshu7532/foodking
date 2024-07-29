/**
 * Order model
 * Represents a Order entity in the database
 * @module models/Order
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Order
 * @class Order
 */

"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            // associations
        }
    }
    Order.init(
        {
            user_id: { type: DataTypes.INTEGER, allowNull: false },
            restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
            food_id: { type: DataTypes.INTEGER, allowNull: false },
            food_details: { type: DataTypes.JSONB, allowNull: true },
            price: { type: DataTypes.FLOAT },
            actual_price: { type: DataTypes.FLOAT },
            discount_price: { type: DataTypes.FLOAT },
            coupon_id: { type: DataTypes.FLOAT },
            estimatedDeliveryTime: { type: DataTypes.INTEGER },
            delivery_address: { type: DataTypes.STRING },
            delivery_coordinates: { type: DataTypes.GEOMETRY('POINT') },
            delivery_time: { type: DataTypes.INTEGER, allowNull: true },
            status: {
                type: DataTypes.ENUM,
                values: ["accepted", "created", "preparing", "prepared", "delivering", "delivered", "cancelled"],
                allowNull: false,
                defaultValue: "created"
            },
            rider_assigned: { type: DataTypes.BOOLEAN },
            rider_id: { type: DataTypes.INTEGER },
            acceptedAt: { type: DataTypes.DATE },
            riderAssignedAt: { type: DataTypes.DATE },
            deliveredAt: { type: DataTypes.DATE },
            cancelledAt: { type: DataTypes.DATE },
            delivery_rating: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            food_rating: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            restaurant_rating: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            coordinates: {
                type: DataTypes.GEOMETRY('POINT')
            },
            remark: { type: DataTypes.STRING }
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
            modelName: "Order",
        }
    );
    return Order;
};
