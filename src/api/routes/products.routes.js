import { Router } from 'express'
import { getProducts, createProduct, updateProduct, deleteProduct, getProduct, randomProducts } from '../controllers/products.controller.js'

const router = Router()

router.get('/test', randomProducts)

router.route('/')
    .get(getProducts)
    .post(createProduct)

router.route('/:id')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct)



export default router
