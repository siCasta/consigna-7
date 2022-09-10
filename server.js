import app from './src/settings.js'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'

const port = normalizePort(process.env.PORT || 8080)
app.set('port', port)

const server = http.createServer(app)
const io = new Server(server)

mongoose.connect('mongodb+srv://siCasta:KAAbg22xkalVCHg6@cluster0.7sqyldr.mongodb.net/consigna-11?retryWrites=true&w=majority').then(() => {
    server.listen(port)
    server.on('error', onError)
    server.on('listening', onListening)
}).catch(err => {
    console.log(err)
    process.exit(1)
})

io.on('connection', socket => {
    console.log('a user connected')

    socket.on('create', async data => {
        const response = await fetch('http://localhost:8080/api/products')
        const products = await response.json()

        socket.broadcast.emit('created', 'Nuevo producto creado')
        io.emit('products', products.data)
    })

    socket.on('connected', async () => {
        const response = await fetch('http://localhost:8080/api/products')
        const products = await response.json()

        const responseC = await fetch('http://localhost:8080/api/chat')
        const chatlog = await responseC.json()

        socket.emit('products', products.data)
        io.emit('log', chatlog)
    })

    socket.on('message', async data => {
        const response = await fetch('http://localhost:8080/api/chat')
        const chatlog = await response.json()

        io.emit('log', chatlog)
    })
})

function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) return val
    if (port >= 0) return port

    return false
}

function onError(error) {
    if (error.syscall !== 'listen') throw error

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
    console.log(`Listening on ${bind}`)
}
