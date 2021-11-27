const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ueatq.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
let connection
// Conexión a Base de datos
async function connectDB() {
    if(connection) return connection
    let client
    try{
        client = await MongoClient.connect(uri,{
            useUnifiedTopology: true 
        })
        connection = client.db(process.env.DBNAME)
        console.log("Conexion a Base de Datos Exitosa")
    }
    catch(error){
        console.log("No se pudo acceder a la Base de Datos", uri, error)
        process.exit()
    }
    return connection
}
module.exports=connectDB;