import db from '../db/config.js'

export async function getMessages(req, res, next) {
    try {
        const messagesDB = await db('chat').select('*')

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
        const { message, user } = req.body

        const messageDB = await db('chat').insert({
            user,
            message,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
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