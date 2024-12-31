import mongoose, { Schema } from "mongoose";


const tagSchema = new Schema({
    tagname: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    }
}, { 
    collection: 'tags',
    timestamps: true 
});

const Tag = mongoose.model('Tag', tagSchema)

export default Tag