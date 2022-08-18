import { Router } from 'express'
import { getMessages, createMessage } from '../controllers/chat.controller.js'

const router = Router()

router.route('/')
    .get(getMessages)
    .post(createMessage)

export default router
