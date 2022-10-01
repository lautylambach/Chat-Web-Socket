const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorMemoria = require('../contenedores/ContenedorMemoria.js')
const ContenedorArchivo = require('../contenedores/ContenedorArchivo.js')

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)


const optionsP = require('./options/mysql.config')
const optionsH =require('./options/sqlite3.config')


const productosApi = new ContenedorMemoria(optionsP, 'products')
const mensajesApi = new ContenedorArchivo(optionsH, 'history')

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    socket.emit('productos', productosApi.listarAll());

    // actualizacion de productos
    socket.on('update', producto => {
        productosApi.guardar(producto)
        io.sockets.emit('productos', productosApi.listarAll());
    })

    // carga inicial de mensajes
    socket.emit('mensajes', await mensajesApi.listarAll());

    // actualizacion de mensajes
    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fyh = new Date().toLocaleString()
        await mensajesApi.guardar(mensaje)
        io.sockets.emit('mensajes', await mensajesApi.listarAll());
    })
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))




//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

const knex = require('knex')
const databaseP = knex(optionsP)
const processDBP = async () => {
    let existTable = await databaseP.schema.hasTable('products')
    if (existTable) {
        console.log('ya existe la tabla')
        databaseP.destroy()
        return
    }
    await databaseP.schema.createTable('products', table => {
        table.increments('id')
        table.string('title', 20)
        table.integer('price')
        table.string('thumbnail', 200)
    })
        .then(() => console.log('Table created!'))
        .catch(err => console.log(err))
        .finally(()=>databaseP.destroy())
        
}
processDBP()

const databaseH = knex(optionsH)
const processDBH = async () => {
    let existTable = await databaseH.schema.hasTable('products')
    if (existTable) {
        console.log('ya existe la tabla')
        databaseH.destroy()
        return
    }
    await databaseH.schema.createTable('history', table => {
        table.increments('id')
        table.string('autor', 30).nullable(false)    
        table.string('fyh', 20).nullable(false)    
        table.float('texto',100)
    })
        .then(() => console.log('Table created!'))
        .catch(err => console.log(err))
        .finally(()=>databaseH.destroy())
        
}
processDBH()