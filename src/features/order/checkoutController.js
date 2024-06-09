import Stripe from 'stripe';
import catchAsync from "../../utils/catchAsync.js";
import OrderModel from "./orderModel.js";

import dotenv from 'dotenv';
import {sendSuccess} from "../../utils/resposeSender.js";

dotenv.config();

// Initialize the Stripe client with the secret key from environment variables
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Define the function to create a checkout session, wrapped in catchAsync to handle errors
const getCheckoutSession = catchAsync(async (req, res) => {
    // Extract the order ID from the request body
    const orderId = req.body.orderId;
    console.log('Creating checkout session for order:', orderId);

    // Find the order by its ID and populate the items with product details
    const order = await OrderModel.findById(orderId).populate('items.product');
    if (!order) {
        console.log('Order not found');
        // If order is not found, send a 404 response
        return res.status(404).json({status: 'fail', message: 'Order not found'});
    }

    console.log('Order found:', order);

    // Map the order items to create the line items for the Stripe session
    const line_items = order.items.map(item => {
        // Construct the cover image URL and replace backslashes and spaces
        let coverImageUrl = `${process.env.BACKEND_PUBLIC_URL}/${item.product.coverImage}`
            .replace(/\\/g, '/') // Replace backslashes with forward slashes
            .replace(/ /g, '%20'); // Replace spaces with %20

        // Return the formatted line item object
        return {
            // Define the pricing details for Stripe
            price_data: {
                // Specify the currency for the price
                currency: 'usd',
                // Define the product details
                product_data: {
                    // Set the product name
                    name: item.name,
                    // Set the product description
                    description: item.product.description,
                    // Set the product images, using the corrected URL
                    images: [coverImageUrl],
                },
                // Convert the product price to cents and set it
                unit_amount: item.price * 100,
            },
            // Set the quantity of the product
            quantity: item.quantity,
        };
    });

    // Log the line items to the console for debugging
    console.log('Line items:', line_items);

    // Create a Stripe checkout session with the line items and URLs
    const session = await stripe.checkout.sessions.create({
        // Specify the accepted payment methods
        payment_method_types: ['card'],
        // Include the line items in the session
        line_items,
        // Set the mode to 'payment' to indicate a one-time payment
        mode: 'payment',
        // Define the success URL, using environment variable for frontend base URL
        success_url: `${process.env.FRONTEND_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
        // Define the cancel URL, using environment variable for frontend base URL
        cancel_url: `${process.env.FRONTEND_BASE_URL}/cancel`,
    });


    console.log('Checkout session created:', session.id);

    // Send the session ID as a JSON response
    res.status(200).json({
        status: 'success',
        sessionId: session.id,
    });
});

// Define the function to update the order status to paid, wrapped in catchAsync to handle errors
const updateOrderToPaid = catchAsync(async (req, res) => {
    // Extract the session ID and order ID from the query parameters
    const sessionId = req.query.session_id;
    const orderId = req.query.order_id;

    console.log('Updating order to paid for session:', sessionId, 'order:', orderId);

    // Retrieve the Stripe session by its ID
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
        console.log('Session not found');
        // If session is not found, send a 404 response
        return res.status(404).json({status: 'fail', message: 'Session not found'});
    }

    // Find the order by its ID
    const order = await OrderModel.findById(orderId);
    if (!order) {
        console.log('Order not found');
        // If order is not found, send a 404 response
        return res.status(404).json({status: 'fail', message: 'Order not found'});
    }

    // Update the order status to paid and set the paid date
    order.isPaid = true;
    order.paidAt = Date.now();

    // Save the updated order
    await order.save();

    console.log('Order updated to paid:', order);

    // Send the updated order as a success response
    sendSuccess(res, order, 200);
});

export default {
    getCheckoutSession,
    updateOrderToPaid
};
