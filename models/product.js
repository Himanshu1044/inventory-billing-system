
import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        require: true,
        min: 0,
        default: 0,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, {
    timestamps: true,
})

productSchema.index({name:'text',category:'text'});
productSchema.index({businessId:1,category:1});
productSchema.index({businessId:1,name:1})

const Product = mongoose.model('Product',productSchema)

export default Product;