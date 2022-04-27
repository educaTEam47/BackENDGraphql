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
            console.log(Users)
        } catch (error) {
            console.error(error);
        }
        return Users
    },
    getUser: async (root, { email }) => {
        let db
        let user
        let error
        let search
        try {
            db = await connectDb()
            if (email === "" || email === null) {
                error = [{ path: "validacion", message: "El ID no es valido" }]
            }
            else {
                user = await db.collection('Users').findOne({ email: email })
                console.log(user)
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
    }, getUserByEmail: async (_, { Email }) => {
        let db
        let user
        let error
        let search
        try {
            db = await connectDb()


            user = await db.collection('Users').findOne({ email: Email })
            console.log("Prueba 1: " + Email);
            console.log("Resultado 1: " + user.email);
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
    },
    getNote: async (root, { idProject }) => {
        let db
        let notes
        let error
        let search
        try {
            db = await connectDb()
            notes = await db.collection('notes').find({ project: idProject }).toArray()
            console.log(notes)
            search = true
        } catch (error) {
            console.error(error);
        }
        return {
            notes,
            search,
            error
        }
    },
    getNot: async (root, { idNote }) => {
        let db
        let notes
        let search
        let error
        try {
            db = await connectDb()
            notes = await db.collection('notes').findOne({ _id: ObjectId(idNote) })
            console.log(notes)
            search = true
        } catch (error) {
            console.error(error);
        }
        return {
            notes,
            search,
            error
        }
    },
    getSolicitudes: async (root,{idProject}) => {
        let db
        let solicitudes
        try {
            db = await connectDb()
            solicitudes = await db.collection('solicitudes').find({solicitud:idProject}).toArray()
            console.log(solicitudes)
        } catch (error) {
            console.error(error);
        }
        return {solicitudes}
    }
}