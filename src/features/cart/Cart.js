import mongoose from "mongoose";
import Product from "../product/Product.js";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    coverImage: {
        type: String,
        required: [true, "Product in cart must have an image"]
    }
}, {timestamps: true});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: [cartItemSchema],
}, {timestamps: true});

cartSchema.virtual('totalPrice').get(function () {
    return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
});

cartSchema.virtual('totalQuantity').get(function () {
    return this.items.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
});

cartSchema.set('toObject', {virtuals: true});
cartSchema.set('toJSON', {virtuals: true});

cartSchema.methods.addItem = async function (product, quantity) {
    const itemIndex = this.items.findIndex(item => item.product.toString() === product._id.toString());

    if (itemIndex === -1) {
        if (quantity > 0) {
            this.items.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                coverImage: product.coverImage
            });
            product.availableStock -= quantity;
            await product.save();
        }
    } else {
        const item = this.items[itemIndex];
        if (quantity === 0) {
            this.items.splice(itemIndex, 1);
            product.availableStock += item.quantity;
            await product.save();
        } else {
            const quantityChange = quantity - item.quantity;
            item.quantity = quantity;
            if (quantityChange > 0) {
                product.availableStock -= quantityChange;
            } else {
                product.availableStock += -quantityChange;
            }
            await product.save();
        }
    }

    await this.save();
    return this;
};

cartSchema.methods.updateItemQuantity = async function (productId, quantity) {
    const item = this.items.find(item => item.product.toString() === productId);

    if (!item) {
        throw new Error('Item not found in cart');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    const quantityChange = quantity - item.quantity;
    item.quantity = quantity;

    if (quantityChange > 0) {
        product.availableStock -= quantityChange;
    } else {
        product.availableStock += -quantityChange;
    }

    await product.save();
    await this.save();
    return this;
};

cartSchema.methods.removeItem = async function (productId) {
    const itemIndex = this.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
        const item = this.items[itemIndex];
        const product = await Product.findById(productId);
        if (product) {
            product.availableStock += item.quantity;
            await product.save();
        }
        this.items.splice(itemIndex, 1);
        await this.save();
    }

    return this;
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
