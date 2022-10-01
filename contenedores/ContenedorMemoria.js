const options = require('../src/options/mysql.config')
const knex = require('knex')

class ContenedorMemoria {
    constructor(options, tableName) {
        const database = knex(options)
        if (!database.schema.hasTable(tableName)) {
            database.schema.createTable(tableName, table => {
                table.increments('id')
                table.string('title', 20)
                table.integer('price')
                table.string('thumbnail', 200)
            })
                .then(() => console.log('Table created!'))
                .catch(err => console.log(err))
        }
        this.database = database
        this.table = tableName
    }

    listar(id) {
        this.database.from(this.table).select('*').where('id', id)
            .then(data=>{
                return(JSON.parse(JSON.stringify(data)))}
                )
            .catch(err => console.log(err,'elemento no encontrado'))
            .finally(()=> this.database.destroy())
    }

    listarAll() {
        this.database.from(this.table).select('*')
            .then(data=>{
                return(JSON.parse(JSON.stringify(data)))}
                )
            .catch(err => console.log(err))
            .finally(()=> this.database.destroy())
    }

    guardar(elem) {
        const newObj = { ...elem}
        this.database(this.table).insert(newObj)
            .then(data=>{
                return(JSON.parse(JSON.stringify(data)))}
            )
            .catch(err => console.log(err))
            .finally(()=> this.database.destroy())
    }

    actualizar(elem, id) {
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${id}`)
        } else {
            this.database.from(this.table).where('id',id).update({...elem})
            .then(data=>{
                return(JSON.parse(JSON.stringify(data)))}
            )
            .catch(err => console.log(err))
            .finally(()=> this.database.destroy())
        }
    }

    borrar(id) {
        if (index == -1) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`)
        }
        this.database.from(this.table).where('id',id).del()
            .then(()=>console.log('producto borrado')
            )
            .catch(err => console.log(err))
            .finally(()=> this.database.destroy())
    }

    borrarAll() {
        this.database.from(this.table).select('*').del()
            .then(()=>console.log('productos borrado'))
            .catch(err => console.log(err))
            .finally(()=> this.database.destroy())
    }
}

module.exports = ContenedorMemoria
