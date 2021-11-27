'use strict'
require('dotenv').config()
const { graphql, buildSchema } = require('graphql');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {readFileSync} = require('fs')
const {join} = require('path')
const {makeExecutableSchema} = require('graphql-tools');
const resolvers  = require('./src/resolver');

//Creacion de App y Ruta
const app = express()
const port = process.env.port || 4000;


// Conexion a Esquemas de GRAPHQL
const typeDefs = readFileSync(
       join(__dirname,'src','schema.graphql'),
       'utf-8'
    )
const schema= makeExecutableSchema({
    typeDefs,resolvers
});

//Ruta para acceder a GRAPHQL
app.use('/', graphqlHTTP({
    schema: schema,
    resolvers: resolvers,
    graphiql: true
}))
//PUERTO DEL SERVIDOR
app.listen(port,()=>{
    console.log("El servidor de encuentra en el puerto", port)
})