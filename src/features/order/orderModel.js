import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: String,
    quantity: Number,
    price: Number,
    coverImage: String,
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [orderItemSchema],
        totalPrice: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            city: {
                type: String,
                required: [true, "Please provide city name"],
            },
            neighborhood: {
                type: String,
                required: [true, "Please provide neighborhood name"],
            },
            streetNumber: {
                type: String,
                required: [true, "Please provide street number"],
            },
            houseNumber: {
                type: String,
                required: [true, "Please provide house number"],
            },

        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["Credit card"],
            default: "Credit card",
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {timestamps: true},
);

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
