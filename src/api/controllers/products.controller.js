import Product from '../models/Product.js'
import { faker } from '@faker-js/faker'

export async function randomProducts(req, res) {
    function randomProduct() {
        return {
            id: faker.datatype.uuid(),
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: faker.image.business()
        }
    }

    let p = []

    for (let i = 0; i < 5; i++) {
        p.push(randomProduct())
    }

    res.json(p)
}

export async function getProducts(req, res, next) {
    try {
        const products = await Product.find()

        return res.status(200).json({
            message: 'Productos obtenidos correctamente',
            data: products,
            status: 'success'
        })
    } catch (err) {
        next(err)
    }
}

export async function getProduct(req, res, next) {
    try {
        const { id } = req.params

        const product = await Product.findById(id)

        return res.status(200).json({
            message: 'Producto obtenido correctamente',
            data: product,
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

        const product = await Product.create({
            title,
            price,
            thumbnail
        })

        return res.status(201).json({
            message: 'Producto creado correctamente',
            data: product,
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

        const product = await Product.findById(id)

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

        await product.update(req.body)

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

        const product = await Product.findById(id)

        if (!product) {
            return next({
                status: 404,
                message: 'Producto no encontrado'
            })
        }

        await product.remove()

        return res.status(200).json({
            message: 'Producto eliminado correctamente',
            status: 'success'
        })
    } catch (err) {
        next(err)
    }
}