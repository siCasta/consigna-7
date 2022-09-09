import mongoose from 'mongoose'

const { Schema, model } = mongoose

const productSchema = Schema({
    title: {
        type: String
    },
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    }
}, {
    timestamps: true
})

export default model('product', productSchema)