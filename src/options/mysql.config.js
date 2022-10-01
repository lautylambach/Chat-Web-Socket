const options = {
    client: 'mysql',
    connection: {
       filename:'../db/myfirstmariadb.sql',
       host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'chat_web_sockets'
    }
    
}

module.exports = options