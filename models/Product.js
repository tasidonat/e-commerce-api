const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    category: {
        type: ObjectID,
        ref: 'Category',
        required: true
    },
    featuredImage: String,
    galleryImages: [String],
    reviews: [
        {
            user: {
                type: ObjectID,
                ref: 'User'
            },
            rating: {
                type: Number,
                required: true
            },
            comment: String,
            createdAt: {
                type: Date,
                default: Date.now
            },
        },
    ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;