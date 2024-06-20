import Stripe from 'stripe';
import catchAsync from "../../utils/catchAsync.js";
import Order from "./Order.js";
import dotenv from 'dotenv';
import axios from 'axios';
import {sendSuccess} from "../../utils/resposeSender.js";

dotenv.config();

// Initialize the Stripe client with the secret key from environment variables
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Function to fetch the current exchange rate from IQD to USD
const getExchangeRate = async () => {
    try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const rates = response.data.rates;
        const iqdToUsd = rates.IQD ? 1 / rates.IQD : null;
        return iqdToUsd;
    } catch (error) {
        throw new AppError('Could not fetch exchange rate', 500);
    }
};

// Define the function to create a checkout session, wrapped in catchAsync to handle errors
const getCheckoutSession = catchAsync(async (req, res) => {
    const orderId = req.body.orderId;

    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
        throw new AppError('Order not found', 404);
    }

    const exchangeRate = await getExchangeRate();
    if (!exchangeRate) {
        throw new AppError('Exchange rate not available', 500);
    }

    const line_items = order.items.map(item => {
        let coverImageUrl = `${process.env.BACKEND_PUBLIC_URL}${item.product.coverImage}`
            .replace(/\\/g, '/')
            .replace(/ /g, '%20');

        const priceInUsd = item.price * exchangeRate;

        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                    description: item.product.description,
                    images: [coverImageUrl],
                },
                unit_amount: Math.round(priceInUsd * 100),
            },
            quantity: item.quantity,
        };
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
        cancel_url: `${process.env.FRONTEND_BASE_URL}/cancel`,
    });

    res.status(200).json({
        status: 'success',
        sessionId: session.id,
    });
});

// Define the function to update the order status to paid, wrapped in catchAsync to handle errors
const updateOrderToPaid = catchAsync(async (req, res) => {
    const sessionId = req.query.session_id;
    const orderId = req.query.order_id;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
        throw new AppError('Session not found', 404);
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new AppError('Order not found', 404);
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    await order.save();

    sendSuccess(res, order, 200);
});

export default {
    getCheckoutSession,
    updateOrderToPaid
};
