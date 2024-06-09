import mongoose, {Schema} from 'mongoose';

const reviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot be more than 5']
    },
    comment: {
        type: String,
        maxlength: [500, 'Comment cannot be more than 500 characters']
    }
}, {timestamps: true});


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
    reviews: [reviewSchema],
    coverImage: {
        type: String,
        required: [true, 'Cover image reqired ']
    },
    images: [
        {
            type: String
        }
    ],
    price: {
        type: Number,
        required: [true, "Price must be included "]
    },
    stock: {
        type: Number,
        required: [true, "Stock psc must be included "]
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
}, {timestamps: true});

// Pre-save middleware to calculate the average rating
productSchema.pre('save', function (next) {
    if (this.reviews.length > 0) {
        this.averageRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
    } else {
        this.averageRating = 0;
    }

    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
