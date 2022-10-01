
const options = require('../src/options/sqlite3.config')
const knex = require('knex')


class ContenedorArchivo {

    constructor(options, tableName) {
        const database = knex(options)
        if (!database.schema.hasTable(tableName)){
            database.schema.createTable('history', table => {
                table.increments('id')
                table.string('autor', 30).nullable(false)    
                table.string('fyh', 20).nullable(false)    
                table.float('texto',100)
            })
                .then(() => console.log('Table created!'))
                .catch(err => console.log(err))
        }
        this.database = database
        this.table = tableName
    }

    async listar(id) {
        this.database.from(this.table).select('*').where('id', id)
            .then(data=>{
                return(JSON.parse(JSON.stringify(data)))}
                )
            .catch(err => console.log(err))
            .finally(()=> this.database.destroy())
    }

    async listarAll() {
        this.database.from(this.table).select('*')
            .then(data=>{
                return(JSON.parse(JSON.stringify(data)))}
                )
            .catch(err => console.log(err))
            .finally(()=> this.database.destroy())
    }

    async guardar(obj) {
        const newObj = { ...obj}
        this.database(this.table).insert(newObj)
            .then(data=>{
                return(JSON.parse(JSON.stringify(data)))}
            )
            .catch(err => console.log(err))
            .finally(()=> this.database.destroy())
    }

    async actualizar(elem, id) {
        
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

    async borrar(id) {
        if (index == -1) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`)
        }
        this.database.from(this.table).where('id',id).del()
            .then(()=>console.log('mensaje borrado')
            )
            .catch(err => console.log(err))
            .finally(()=> this.database.destroy())
    }

    async borrarAll() {
        this.database.from(this.table).select('*').del()
            .then(()=>console.log('historial borrado'))
            .catch(err => console.log(err))
            .finally(()=> this.database.destroy())
    }
}

module.exports = ContenedorArchivo