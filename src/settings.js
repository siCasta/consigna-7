import 'dotenv/config'
import { dirname } from 'dirname-es'
import express from 'express'
import logger from 'morgan'
import createError from 'http-errors'
import { join } from 'path'

// import routes
import apiRoute from './api/routes/index.js'
import webRoute from './web/routes/index.js'

const app = express()
const __dirname = dirname(import.meta)

// settings
app.set('views', join(__dirname, 'web/views'))
app.set('view engine', 'ejs')

// middelwares
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(join(__dirname, '../public')))

// routes
app.use('/api', apiRoute)
app.use('/', webRoute)

// 404 handler
app.use((req, res, next) => {
    next(createError(404, 'Not found'))
})

// error handler
app.use((err, req, res, next) => {
    const message = err.message
    const error = process.env.NODE_ENV === 'development' ? err : {}

    res.status(err.status || 500).json({
        message: message,
        status: error?.status,
        stack: error?.stack
    })
})

export default app