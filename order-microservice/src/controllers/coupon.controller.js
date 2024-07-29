/**
 * Controller for handling coupon-related operations.
 * @file Coupon Controller
 * @module Coupon Controller
 * @category controllers
 * @subcategory Coupon
 */

import db from "../models/index.js"
import { Op } from "sequelize"


const is_prod = process.env.NODE_ENV === "production" ? true : false


const { Coupon, CouponClaimed } = db



/**
 * Creating coupon (only restaurant can provide coupon)
 */
export async function createCoupon(request, reply) {
    try {
        const { coupon_code, percentage, max_credit, valid_till } = request.body
        await Coupon.create({
            coupon_code: coupon_code,
            percentage: percentage,
            max_credit: max_credit,
            valid_till: valid_till,
            restaurant_id: request.user.id
        })
        return reply.status(200).send({ message: "Coupon created" })
    } catch (error) {
        return reply.status(500).send({ error: error.message })
    }
}
/**
 * checking coupon is valid or not
 */
export async function couponValid(request, reply) {
    try {
        const { coupon_code = null } = request.params;
        const coupon = await Coupon.findOne({ where: { coupon_code: coupon_code } });

        // Check if coupon exists
        if (!coupon) {
            return reply.status(404).send({ error: 'Coupon code not found' });
        }

        // Check if the coupon is still valid
        const currentDate = new Date();
        if (currentDate > coupon.valid_till) {
            return reply.status(400).send({ error: 'Coupon code is expired' });
        }

        const coupon_claimed = await CouponClaimed.findOne({ where: { user_id: request.user.id, coupon_id: coupon.id } })

        if (coupon_claimed) {
            return reply.status(400).send({ error: "Coupon already applied" })
        }
        // If coupon is valid
        return reply.status(200).send({ message: 'Coupon code is valid', coupon });
    } catch (error) {
        return reply.status(500).send({ error: error.message })
    }
}


/**
 * get valid coupons according to user
 */

export async function getAllCoupons(request, reply) {
    try {
        const { restaurant_id } = request.params;
        const user_id = request.user.id;

        // Get current date
        const currentDate = new Date();

        // Find all valid coupons for the given restaurant
        const validCoupons = await Coupon.findAll({
            where: {
                restaurant_id,
                valid_till: {
                    [Op.gt]: currentDate
                }
            },
            include: {
                model: CouponClaimed,
                as: 'claims',
                required: false,
                where: {
                    user_id
                }
            }
        });

        // Filter out coupons already claimed by the user
        console.log("this is valid coupons", validCoupons)
        const unclaimedCoupons = validCoupons.filter(coupon => coupon.claims.length === 0);

        reply.status(200).send(unclaimedCoupons);
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
}