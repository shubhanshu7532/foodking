/**
 * Controller for handling user-related operations.
 * @file User Controller
 * @module User Controller
 * @category controllers
 * @subcategory user
 */

import db from "../models/index.js"
// import cache from "../../utils/cache.util.js"
import { Op } from "sequelize"
import logger from "./../utils/logger.util.js"
import { authFetch } from "../ApiCalls/authFetch.js"

const is_prod = process.env.NODE_ENV === "production" ? true : false


const { Order, Coupon, CouponClaimed } = db

/**
 * Create order with applying coupon or without applying coupon
 * @returns 
 */
export async function createOrder(request, reply) {
    try {
        const { restaurant_id, food_id, delivery_address, longitude, latitude, coupon_id = null } = request.body
        //1. getting restaurant and food details by restaurant microservice
        const restaurant_and_food = await authFetch.get(`${process.env.RESTAURANT_MS_BASE_URL}/restaurant/microservice/restaurant/restaurant-and-food?restaurant_id=${restaurant_id}&food_id=${food_id}`)
        if (!restaurant_and_food) {
            return reply.status(403).send({ error: "Please enter correct details" })
        }

        let data = {}

        if (coupon_id !== null) {
            //1.checking coupon is valid or not
            const coupon = await Coupon.findOne({ where: { id: parseInt(coupon_id) } });
            if (!coupon) {
                return reply.status(404).send({ error: 'Coupon code not found' });
            }

            // Check if the coupon is still valid
            const currentDate = new Date();
            if (currentDate > coupon.valid_till) {
                return reply.status(400).send({ error: 'Coupon code is expired' });
            }

            // checking coupon already used or not
            const coupon_claimed = await CouponClaimed.findOne({ where: { user_id: request.user.id, coupon_id: coupon.id } })

            if (coupon_claimed) {
                return reply.status(400).send({ error: "Coupon already applied" })
            }

            // calculating discount according to coupon
            const price = parseFloat(restaurant_and_food.food.price)
            const percentage = parseFloat(coupon.percentage)
            let discount_price = parseInt((percentage / 100) * price);
            if (discount_price > parseInt(coupon.max_credit)) {
                discount_price = coupon.max_credit
            }
            const actual_price = parseFloat(price - discount_price)

            data = {
                restaurant_id: parseInt(restaurant_id),
                food_id: parseInt(food_id),
                user_id: parseInt(request.user.id),
                food_details: { ...restaurant_and_food.food },
                price: parseFloat(restaurant_and_food.food.price),
                actual_price: actual_price,
                discount_price: discount_price,
                coupon_id: coupon.id,
                delivery_address: delivery_address,
                remark: "Your order created"
            }

            // inserting coupen is claimed by user
            await CouponClaimed.create({
                user_id: request.user.id,
                coupon_id: coupon.id
            })

        } else {
            data = {
                restaurant_id: parseInt(restaurant_id),
                food_id: parseInt(food_id),
                user_id: parseInt(request.user.id),
                food_details: { ...restaurant_and_food.food },
                price: parseFloat(restaurant_and_food.food.price),
                actual_price: parseFloat(restaurant_and_food.food.price),
                delivery_address: delivery_address,
                remark: "Your order created"
            }
        }

        // creating order
        await Order.create(data)
        return reply.status(200).send({ message: "Your order created successfully" })

    } catch (error) {
        logger.error(`order.controller.createOrder: ${error}`)
        return reply.status(500).send({ error: error.message })

    }
}

/**
 * Routing for accepting the order on restaurant side
 * Requires restaurant authentication
 * @param {*} request  params-order_id, body-status,deliveryTime,remark
 * @param {*} reply success response in object
 * @returns a success response
 */

export async function acceptOrder(request, reply) {
    try {
        const { status = "accepted", estimatedDeliveryTime = 0, remark = "" } = request.body
        const { order_id } = request.params
        //1. Finding order
        const order = await Order.findOne({ where: { id: order_id } })

        //2. Checking is restaurant allowed to accept the order or not
        if (request.user.id !== order.restaurant_id) {
            return reply.status(403).send({ error: "Your are not authorized to do make changes in this order" })
        }
        //3. This controller only accept  status accepted
        if (status !== 'accepted') {
            return reply.status(403).send({ error: "Only for accepting the offer" })
        }

        //4. IF order already cancelled then we cannot accept the order
        if (order.cancelledAt) {
            return reply.status(403).send({ error: "Order is cancelled" })
        }

        //5. updating order status and estimated delivery time
        order.status = status
        if (estimatedDeliveryTime < 1) return reply.status(403).send({ error: "Please enter correct estimated deliver time" })

        order.estimatedDeliveryTime = estimatedDeliveryTime
        order.remark = remark
        order.acceptedAt = Date.now()
        await order.save()
        return reply.status(200).send({ error: "Order accepted successfully" })

    } catch (error) {
        logger.error(`accept.controller.acceptOrder: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}

/**
 * change status of code by restaurant mainly on this route he will do preparing or prepared
 * @returns success response
 */

export async function changeStatusOfOrder(request, reply) {
    try {
        const { status, remark } = request.body
        const { order_id } = request.params

        //1. Finding order
        const order = await Order.findOne({ where: { id: order_id } })
        if (request.user.id !== order.restaurant_id) {
            return reply.status(403).send({ error: "Your are not authorized to do make changes in this order" })
        }

        //2. If order status is not belongs to preparing or prepared then throwing error
        if (status !== "preparing" && status !== "prepared") {
            return reply.status(403).send({ error: "Your are not authorized to do make some different status for this order" })
        }

        //3. If order is cancelled then no need to update its status
        if (order.cancelledAt) {
            return reply.status(403).send({ error: "Order is cancelled" })
        }

        //4. updating order
        order.status = status
        order.remark = remark
        await order.save()
        return reply.status(200).send({ error: "Order status changes successfully" })
    } catch (error) {
        logger.error(`user.controller.login: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}

/**
 * get all orders created by user also you can apply filter on the basis of status
 * @returns 
 */

export async function getAllOrderForUser(request, reply) {
    try {
        const { status = 'all', limit = 10, skip = 0 } = request.query
        let where = {}
        if (status !== 'all') {
            where.status = status
        }
        where.user_id = request.user.id
        const all_orders = await Order.findAll({
            where,
            limit,
            offset: skip,
            order: [['createdAt', 'DESC']]
        })
        return reply.status(200).send(all_orders)

    } catch (error) {
        logger.error(`user.controller.login: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}

/**
 * get all orders assigned to rider
 * @returns 
 */

export async function getAllOrderForRider(request, reply) {
    try {
        const { status = 'delivering', limit = 10, skip = 0 } = request.query
        let where = {}
        if (status !== 'delivering' && status !== 'delivered' && status !== 'cancelled') {
            return reply.status(200).send([])
        }
        where.rider_id = request.user.id
        const all_orders = await Order.findAll({
            where,
            limit,
            offset: skip,
            order: [['createdAt', 'DESC']]
        })
        return reply.status(200).send(all_orders)

    } catch (error) {
        logger.error(`user.controller.login: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}


/**
 * get all orders comes to restaurant
 * @returns 
 */

export async function getAllOrderForRestaurant(request, reply) {
    try {
        const { status = 'all', limit = 10, skip = 0 } = request.query
        let where = {}
        if (status !== 'all') {
            where.status = status
        }
        where.restaurant_id = request.user.id
        const all_orders = await Order.findAll({
            where,
            limit,
            offset: skip,
            order: [['createdAt', 'DESC']]
        })
        return reply.status(200).send(all_orders)


    } catch (error) {
        logger.error(`order.controller.getAllOrderForRestaurant: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}

/**
 * order delivered function to make order is successfully delivered
 * it also calculate time taken to deliver the order and update the success count of delivery at restaurant
 * @returns 
 */

export async function orderDelivered(request, reply) {
    try {
        const { order_id } = request.params

        //1. Finding the order
        const order = await Order.findOne({ where: { id: parseInt(order_id), rider_id: parseInt(request.user.id) } })
        if (!order) {
            return reply.status(404).send({ error: "order not found" })
        }

        //2. If order cancelled then you cannot deliver it
        if (order.cancelledAt) {
            return reply.status(403).send({ error: "Order is cancelled" })
        }
        order.status = "delivered"
        order.remark = "Your order is delivered"
        order.deliveredAt = Date.now()
        const acceptedAt = order.acceptedAt
        const deliveredAt = order.deliveredAt
        //3. calculating order timing
        let diffInMilliseconds
        if (acceptedAt && deliveredAt) {
            diffInMilliseconds = deliveredAt - acceptedAt;
            diffInMilliseconds = Math.floor(diffInMilliseconds / 60000); // Convert to minutes
            console.log(diffInMilliseconds)
        }
        order.delivery_time = diffInMilliseconds

        //4. updating delivery time on restaurants
        const restaurant_delivery_update = await authFetch.post(`${process.env.RESTAURANT_MS_BASE_URL}/restaurant/microservice/restaurant/delivery-time`, {
            restaurant_id: order.restaurant_id,
            delivery_time: diffInMilliseconds
        })
        if (!restaurant_delivery_update) {
            return reply.status(500).send({ error: "Internal server error" })
        }

        //5. updating delivery rider 
        const delivery_rider = await authFetch.get(`${process.env.RIDER_MS_BASE_URL}/rider/microservice/rider/order-delivered/${request.user.id}`)
        if (!delivery_rider) return reply.status(500).send({ error: "Internal server error" })
        await order.save()
        return reply.status(200).send({ error: "order delivered success" })
    } catch (error) {
        logger.error(`user.controller.login: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}

/**
 * Route to cancel the order from user side
 */

export async function orderCancel(request, reply) {
    try {
        const { order_id } = request.params
        const order = await Order.findOne({ where: { id: parseInt(order_id), user_id: parseInt(request.user.id) } })
        if (!order) {
            return reply.status(404).send({ error: "order not found" })
        }
        if (order.cancelledAt) {
            return reply.status(403).send({ error: "Order is already cancelled" })
        }
        if (order.status === "delivered") {
            return reply.status(403).send({ error: "Order is delivered" })
        }
        order.status = "cancelled"
        order.remark = "Your order is cancelled"
        order.cancelledAt = new Date.now()
        await order.save()
    } catch (error) {
        logger.error(`user.controller.login: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}

/**
 * Route to assigning the order to rider
 * @returns success response
 */

export async function assignOrder(request, reply) {
    try {
        const { order_id, rider_id } = request.body

        //1. Finding order
        const order = await Order.findOne({ where: { id: order_id } })

        //2. Checking if restaurant exist to same order
        if (order.restaurant_id !== request.user.id) return reply.status(403).send({ error: "You are not authorized to assign this order" })

        //3. Checking if rider already assigned    
        if (order.rider_assigned) return reply.status(403).send({ error: "order alreeady assigned" })

        //4. finding rider info    
        const rider = await authFetch.get(`${process.env.RIDER_MS_BASE_URL}/rider/microservice/rider/rider-info/${rider_id}`)
        if (!rider) return reply.status(404).send({ error: "Rider not found" })

        //5. checking if rider is busy   
        if (rider.is_busy) {
            return reply.status(404).send({ error: "Rider is busy right now" })
        }

        //6. checking if order is cancelled 
        if (order.status === "cancelled") return reply.status(403).send({ error: "order already cancelled" })
        order.rider_id = parseInt(rider_id)
        order.rider_assigned = true
        order.status = "delivering"
        const assigned_rider = await authFetch.get(`${process.env.RIDER_MS_BASE_URL}/rider/microservice/rider/assign-order/${rider.id}`)
        if (!assigned_rider) {
            return reply.status(500).send({ error: "Internal server error" })
        }
        await order.save()
        return reply.status(200).send({ message: "Order assigned successfully" })
    } catch (error) {
        logger.error(`user.controller.login: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}

/**
 * create rating from user side
 */

export async function createRating(request, reply) {
    try {
        const order_id = request.params.order_id
        const { delivery_rating, food_rating, restaurant_rating } = request.body
        if (delivery_rating < 1 || delivery_rating > 5) {
            return reply.status(403).send({ error: "Rating must be in between 1 to 5" })
        }
        if (food_rating < 1 || food_rating > 5) {
            return reply.status(403).send({ error: "Rating must be in between 1 to 5" })
        }
        if (restaurant_rating < 1 || restaurant_rating > 5) {
            return reply.status(403).send({ error: "Rating must be in between 1 to 5" })
        }

        //1. updating rating in the order
        const order = await Order.findOne({ where: { id: parseInt(order_id) } })
        order.delivery_rating = delivery_rating
        order.food_rating = food_rating
        order.restaurant_rating = restaurant_rating

        //2. updating rider rating
        const rider = await authFetch.post(`${process.env.RIDER_MS_BASE_URL}/rider/microservice/rider/update-rating/${order.rider_id}`, {
            delivery_rating: delivery_rating
        })
        if (!rider) return reply.status(500).send("Internal server error")

        //3. updating restaurant rating    
        const restaurant = await authFetch.post(`${process.env.RESTAURANT_MS_BASE_URL}/restaurant/microservice/restaurant/update-rating?restaurant_id=${order.restaurant_id}&food_id=${order.food_id}`, {
            food_rating: food_rating,
            restaurant_rating: restaurant_rating
        })

        if (!restaurant) {
            return reply.status(500).send("Internal server error")
        }

        await order.save()
        return reply.status(200).send({ message: "Thanks for rating" })

    } catch (error) {
        logger.error(`user.controller.login: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}