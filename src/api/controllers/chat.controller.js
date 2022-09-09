import Chat from '../models/Chat.js'

export async function getMessages(req, res, next) {
    try {
        const messagesDB = await Chat.find()

        return res.status(200).json({
            message: 'Mensajes obtenidos correctamente',
            data: messagesDB,
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