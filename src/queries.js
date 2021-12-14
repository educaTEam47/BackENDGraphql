'use strict'
const connectDb = require('./db')
const { ObjectId } = require('mongodb')

module.exports = {
    getUsers: async () => {
        let db
        let Users
        try {
            db = await connectDb()
            Users = await db.collection('Users').find().toArray()
            //console.log(Users)
        } catch (error) {
            console.error(error);
        }
        return Users
    },
    getUser: async (root, { id }) => {
        let db
        let user
        let error
        let search
        try {
            db = await connectDb()
            if (id.length !== 24) {
                error = [{ path: "validacion", message: "El ID no es valido" }]
            }
            else {
                user = await db.collection('Users').findOne({ _id: ObjectId(id) })
                //console.log(id)
                if (user == null) {
                    error = [{ path: "Validacion", message: "El usuario no existe" }]
                    search = false
                }
                else {
                    search = true
                }
            }
            //console.log(user)
            //console.log(error)
        } catch (error) {
            console.error(error);
        }
        return {
            user,
            search,
            error
        }
    },getUserByEmail: async (_, { Email }) => {
        let db
        let user
        let error
        let search
        try {
            db = await connectDb()
        
            
                user = await db.collection('Users').findOne({ email:Email })
                console.log("Prueba 1: "+Email);
                console.log("Resultado 1: "+user.email);
                if (user == null) {
                    error = [{ path: "Validacion", message: "El usuario no existe" }]
                    search = false
                }
                else {
                    search = true
                }
            
            //console.log(user)
            //console.log(error)
        } catch (error) {
            console.error(error);
        }
        return {
            user,
            search,
            error
        }
    },
    getProjects: async () => {
        let db
        let project
        try {
            db = await connectDb()
            project = await db.collection('projects').find().toArray()
            //console.log(project)
        } catch (error) {
            console.error(error);
        }
        return project
    },
    getProject: async (root, { id }) => {
        let db
        let project
        try {
            db = await connectDb()
            project = await db.collection('projects').findOne({ _id: ObjectId(id) })
        } catch (error) {
            console.error(error);
        }
        return project
    }
}