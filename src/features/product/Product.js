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
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
},);

//    const allProducts = await Product.findById(productId).populate("category", "name _id").populate('reviews')
// you have to populate it
productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
});

const Product = mongoose.model('Product', productSchema);

export default Product;

// Pre-save middleware to calculate the average rating
// productSchema.pre('save', function (next) {
//     if (this.reviews.length > 0) {
//         this.averageRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
//     } else {
//         this.averageRating = 0;
//     }
//
//     next();
// });
