import knex from 'knex'
import { dirname } from 'dirname-es'

const __dirname = dirname(import.meta)
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: `${__dirname}/database.sqlite`
    },
    useNullAsDefault: true
})

const existP = await db.schema.hasTable('products')
const existC = await db.schema.hasTable('chat')

if (!existP) {
    await db.schema.createTable('products', table => {
        table.string('id').primary()
        table.string('title')
        table.integer('price')
        table.string('thumbnail')
        table.timestamps(true, true)
    })
} else {
    db('products').del()
}

if (!existC) {
    await db.schema.createTable('chat', table => {
        table.increments('id').primary()
        table.string('user')
        table.string('message')
        table.string('date')
        table.string('time')
    })
} else {
    db('chat').del()
}


export default db