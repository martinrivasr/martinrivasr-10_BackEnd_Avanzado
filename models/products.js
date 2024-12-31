import mongoose, { Schema } from "mongoose";


const productSchema = new Schema({
    product: {
        type: String,
        required: true,
        trim: true,
    },
    precio: {
        type: Number,
        min: 0, 
        required: true,
    },
    picture: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} no es una URL válida!`
        }
    },
    tags:[{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { 
    collection: 'products',
    timestamps: true 
});

const Product = mongoose.model('Product', productSchema)

export default Product