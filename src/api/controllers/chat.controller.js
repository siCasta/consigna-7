import Chat from '../models/Chat.js'
import { normalize, schema, denormalize } from 'normalizr'

export async function getMessages(req, res, next) {
    try {
        const messagesDB = await Chat.find().select('-__v')

        const author = new schema.Entity('authors')
        const chat = new schema.Entity('messages', {
            author
        }, { idAttribute: '_id' })

        const normalizeData = normalize(JSON.parse(JSON.stringify(messagesDB)), [chat])

        return res.status(200).json({
            message: 'Mensajes obtenidos correctamente',
            data: normalizeData.entities,
            status: 'success'
        })
    } catch (err) {
        next(err)
    }
}

export async function createMessage(req, res, next) {
    try {
        const { message, author } = req.body

        const messageDB = await Chat.create({
            author,
            message
        })

        return res.status(200).json({
            message: 'Mensaje creado correctamente',
            data: messageDB,
            status: 'success'
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
}