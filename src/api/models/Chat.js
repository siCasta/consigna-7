import mongoose from 'mongoose'

const { Schema, model } = mongoose

const chatSchema = Schema({
    author: {
        id: {
            type: String
        },
        name: {
            type: String
        },
        surname: {
            type: String
        },
        age: {
            type: Number
        },
        alias: {
            type: String
        },
        avatar: {
            type: String
        }
    },
    message: {
        type: String
    }
}, {
    timestamps: true
})

export default model('chat', chatSchema)