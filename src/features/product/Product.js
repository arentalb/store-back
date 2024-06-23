import mongoose, {Schema} from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required']
    },
    images: [
        {
            type: String
        }
    ],
    price: {
        type: Number,
        required: [true, "Price must be included"]
    },
    stock: {
        type: Number,
        required: [true, "Stock must be included"]
    },
    availableStock: {
        type: Number,
        required: [true, "Available stock must be included"]
    },
    tags: [{
        type: String,
        maxlength: [50, 'Tag cannot be more than 50 characters']
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: [0, 'Average rating must be at least 0'],
        max: [5, 'Average rating cannot be more than 5']
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
});

productSchema.methods.decrementAvailableStock = async function (quantity) {
    if (this.availableStock < quantity) {
        throw new Error("Insufficient available stock");
    }
    this.availableStock -= quantity;
    await this.save();
};

productSchema.methods.incrementAvailableStock = async function (quantity) {
    this.availableStock += quantity;
    await this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;
