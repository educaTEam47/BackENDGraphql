'use strict'
require('dotenv').config()
const { graphql, buildSchema } = require('graphql');
const cors = require('cors')
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {readFileSync} = require('fs')
const {join} = require('path')
const {makeExecutableSchema} = require('graphql-tools');
const resolvers  = require('./src/resolver');

var corsOptions = {
    credentials:true,
    origin: 'http://localhost:3000', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
//Creacion de App y Ruta
const app = express()
const port = process.env.port || 4000;
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Token","Aqui va el token")
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(
    (req,res,next)=>{
        //console.log(req.headers.authorization)
        next()
    }
)

// Conexion a Esquemas de GRAPHQL
const typeDefs = readFileSync(
       join(__dirname,'src','schema.graphql'),
       'utf-8'
    )
const schema= makeExecutableSchema({
    typeDefs,
    resolvers,
    context:({req,res})=>({res,req})
});

//Ruta para acceder a GRAPHQL
app.use('/', graphqlHTTP({
    schema: schema,
    resolvers: resolvers,
    graphiql: true
}))
app.use(cors(corsOptions))
//PUERTO DEL SERVIDOR
app.listen(port,()=>{
    console.log("El servidor de encuentra en el puerto", port)
})