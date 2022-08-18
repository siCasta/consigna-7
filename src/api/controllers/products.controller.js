import cacheC from '../../utils/cache.js'
import db from '../db/config.js'
import { randomId } from '../../utils/randomid.js'

const cache = new cacheC

export async function getProducts(req, res, next) {
    try {
        const productsDB = await db('products').select('*')

        return res.status(200).json({
            message: 'Productos obtenidos correctamente',
            data: productsDB,
            status: 'success'
        })
    } catch (err) {
        next(err)
    }
}

export async function getProduct(req, res, next) {
    try {
        const { id } = req.params

        const productCache = cache.get(`product-${id}`)

        if (!productCache) {
            const productDB = await db('products').where({ id }).select('*')

            if (!productDB) {
                return next({
                    status: 404,
                    message: 'Producto no encontrado'
                })
            }

            cache.set(`product-${id}`, productDB)

            return res.status(200).json({
                message: 'Producto obtenido correctamente',
                data: productDB,
                status: 'success'
            })
        }

        return res.status(200).json({
            message: 'Producto obtenido correctamente',
            data: productCache,
            status: 'success'
        })

    } catch (err) {
        next(err)
    }
}

export async function createProduct(req, res, next) {
    try {
        const { title, price, thumbnail } = req.body

        if (!title || !price || !thumbnail) {
            return next({
                status: 400,
                message: 'Todos los campos son obligatorios'
            })
        }

        await db('products').insert({ id: randomId(), title, price, thumbnail })

        return res.status(201).json({
            message: 'Producto creado correctamente',
            status: 'success'
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
}

export async function updateProduct(req, res, next) {
    try {
        const { id } = req.params
        const { title, price, thumbnail } = req.body

        const product = await db('products').where({ id }).select('*')

        if (!product) {
            return next({
                status: 404,
                message: 'Producto no encontrado'
            })
        }

        if (!title || !price || !thumbnail) {
            return next({
                status: 400,
                message: 'Todos los campos son obligatorios'
            })
        }

        await db('products').where({ id }).update({ title, price, thumbnail })
        const productUpdated = await db('products').where({ id }).select('*')

        cache.set(`product-${id}`, productUpdated)

        return res.status(200).json({
            message: 'Producto actualizado correctamente',
            status: 'success'
        })
    } catch (err) {
        next(err)
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params

        const product = await db('products').where({ id }).select('*')

        if (!product) {
            return next({
                status: 404,
                message: 'Producto no encontrado'
            })
        }

        await db('products').where({ id }).del()
        const products = await db('products').select('*')

        cache.set('products', products)

        return res.status(200).json({
            message: 'Producto eliminado correctamente',
            status: 'success'
        })
    } catch (err) {
        next(err)
    }
}