'use strict'
const connectDb = require('./db')
const { ObjectId } = require('mongodb')
const connectDB = require('./db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Headers } = require("node-fetch");
const { response } = require('express');


module.exports = {
    registro: async (root, { input }) => {
        let db
        let usuario
        let searchusername
        let searchEmail
        let error
        let register
        let message
        const user = Object.assign(input)
        try {
            db = await connectDb()
            //console.log(usuario)
            if (user.nombres == null || user.nombres == "") {
                error = [{ path: "Campo", message: "Debe llenar el campo nombres" }]
            }
            else if (user.apellidos == null || user.apellidos == "") {
                error = [{ path: "Campo", message: "Debe llenar el campo apellidos" }]
            }
            else if (user.username == null || user.username == "") {
                error = [{ path: "Campo", message: "Debe llenar el campo username" }]
            }
            else if (user.email == null || user.email == "") {
                error = [{ path: "Campo", message: "Debe llenar el campo email" }]
            }
            else if (user.password == null || user.password == "") {
                error = [{ path: "Campo", message: "Debe llenar el campo password" }]
            }
            else if (user.rol == null || user.rol == "") {
                error = [{ path: "Campo", message: "Debe seleccionar un rol" }]
            }
            else {
                const saltos = await bcrypt.genSalt(10);
                const passwordcrypt = await bcrypt.hash(user.password, saltos);
                user.password = passwordcrypt
                searchusername = await db.collection('Users').findOne({ username: user.username })
                searchEmail = await db.collection('Users').findOne({ email: user.email })
                if (searchusername == null && searchEmail == null) {
                    usuario = await db.collection('Users').insertOne(user)
                    register = true
                }
                else {
                    console.log("El nombre de usuario o el Email ya existe")
                    error = [{ path: "Validacion", message: "El nombre de usuario o el Email ya existe" }]
                    register = false
                }
            }
        } catch (error) {
            console.error(error);
        }
        return {
            user,
            register,
            error
        }
    },
    login: async (root, { input }, { req, res }) => {
        let db
        let login
        let error
        let token
        let searchusername
        let searchpassword
        //console.log(res)
        const user = Object.assign(input)
        try {
            db = await connectDb()
            searchusername = await db.collection('Users').findOne({ username: user.username })
            if (!searchusername) {
                error = [{ path: "username", message: "No se encuentra el username en la base de datos" }]
            }
            //console.log(searchusername)
            searchpassword = await bcrypt.compare(user.password, searchusername.password)
            if (!searchpassword) {
                error = [{ path: "Password", message: "La contraseña no es valida" }]
            }
            //console.log(searchpassword)
            let cadena = searchusername.nombres + " "
            let index = cadena.indexOf(" ")
            let nombres = cadena.substring(0, index)
            //console.log(nombres)
            if (error == null) {
                login = true
                token = jwt.sign({
                    id: searchusername._id,
                    nombre: nombres,
                    rol: searchusername.rol
                },
                    process.env.TOKEN_SECRET,
                    { expiresIn: '15m' }
                )
                //let myHeaders = new Headers()
                //myHeaders.append('Token',token)
                //let headToken=myHeaders.get('Token')
                //res.setHeader('Token',token)
                //console.log(headToken)
            }
        } catch (error) {
            console.error(error);
        }
        return {
            login,
            token,
            error
        }
    },
    createProject: async (root, { input }) => {
        let db
        let addproject
        let search
        let create
        let error
        const Project = Object.assign(input)
        try {
            db = await connectDb()
            if (input.tittle == null || input.tittle == "") {
                error = [{ path: "Campo", message: "Debe llenar el campo Titulo" }]
            }
            else if (input.description == null || input.description == "") {
                error = [{ path: "Campo", message: "Debe llenar el campo de descripcion" }]
            }
            else if (input.Horas == null || input.Horas == "") {
                error = [{ path: "Campo", message: "Debe llenar el campo de Horas" }]
            }
            else {
                search = await db.collection('projects').findOne({ tittle: Project.tittle })
                if (search == null) {
                    addproject = await db.collection('projects').insertOne(Project)
                    Project._id = addproject.insertedId
                    create = true
                }
                else {
                    error = [{ path: "Validacion", message: "El titulo del proyecto ya existe" }]
                    create = false
                }
            }
        } catch (error) {
            console.error(error);
        }
        return {
            Project,
            create,
            error
        }
    },
    updateUser: async (root, { id, input }) => {
        let db
        let user
        let error
        let update
        let search
        let newemail
        let searchEmail
        let index1
        let index2
        try {
            db = await connectDb()
            console.log(id, input)
            search = await db.collection('Users').findOne({ _id: ObjectId(id) })
            if (input.email) {
                index1 = input.email.indexOf("@")
                newemail = input.email.substring(0, index1)
                newemail = newemail.toUpperCase()
            }
            else {
                newemail = search.email
            }
            index2 = search.email.indexOf("@")
            searchEmail = search.email.substring(0, index2)
            searchEmail = searchEmail.toUpperCase()
            if (searchEmail != newemail) {
                if (typeof input.numidetificacion == 'number' || input.numidetificacion == null) {
                    update = true
                    await db.collection('Users').updateOne(
                        { _id: ObjectId(id) },
                        { $set: input }
                    )
                }
                else {
                    error = [{ path: "Validacion", message: "El numero de identificaion debe ser un numero" }]
                }
            }
            else {
                error = [{ path: "Validacion", message: "El correo ya se encuentra registrado, por ende no se ha actualizado" }]
                update = true
                input.email = search.email
                await db.collection('Users').updateOne(
                    { _id: ObjectId(id) },
                    { $set: input }
                )
            }
            user = await db.collection('Users').findOne({ _id: ObjectId(id) })
            console.log(user)

        } catch (error) {
            console.error(error);
        }
        return {
            user,
            update,
            error
        }
    },
    addStudent: async (root, { idStudent, idProject }) => {
        let db
        let project
        let student
        let add
        let error
        try {
            db = await connectDb()
            //console.log(idStudent,idProject)
            project = await db.collection('projects').findOne({ _id: ObjectId(idProject) })
            student = await db.collection('Users').findOne({ _id: ObjectId(idStudent) })
            //console.log(project, student)
            if (!student) {
                error = [{ path: "Validacion", message: "No existe el estudiante" }]
                add = false
            }
            else if (!project) {
                error = [{ path: "Validacion", message: "No existe el proyecto" }]
                add = false
            }
            else {
                if (student.rol == "Estudiante") {
                    await db.collection('Users').updateOne(
                        { _id: ObjectId(idStudent) },
                        { $addToSet: { cursos: idProject } }
                    )
                    await db.collection('projects').updateOne(
                        { _id: ObjectId(idProject) },
                        { $addToSet: { people: idStudent } }
                    )
                    add = true
                }
                else {
                    error = [{ path: "Validacion", message: "El id no corresponde a un Estudiante" }]
                }
            }
        } catch (error) {
            console.error(error);
        }
        return {
            project,
            add,
            error
        }
    },
    addTeacher: async (root, { idTeacher, idProject }) => {
        let db
        let project
        let teacher
        let add
        let error
        try {
            db = await connectDb()
            if (idTeacher.length != 24 || idProject.length != 24) {
                error = [{ path: "Validacion", message: "El ID introducido, no es un ID valido" }]
            }
            else {
                project = await db.collection('projects').findOne({ _id: ObjectId(idProject) })
                teacher = await db.collection('Users').findOne({ _id: ObjectId(idTeacher) })
                //console.log(project, teacher)
                if (!project) {
                    error = [{ path: "validacion", message: "El proyecto no existe" }]
                    add = false
                }
                else if (!teacher) {
                    error = [{ path: "Validacion", message: "El profesor no existe" }]
                    add = false
                }
                else {
                    if (teacher.rol == "Lider") {
                        await db.collection('Users').updateOne(
                            { _id: ObjectId(idTeacher) },
                            { $addToSet: { cursos: idProject } }
                        )
                        await db.collection('projects').updateOne(
                            { _id: ObjectId(idProject) },
                            { $addToSet: { lider: idTeacher } }
                        )
                        add = true
                    }
                    else {
                        error = [{ path: "Validacion", message: "El id presentado no corresponde a un profesor" }]
                        add = false
                    }
                }

            }

        } catch (error) {
            console.error(error);
        }
        return {
            project,
            add,
            error
        }
    },
    updateProject: async (root, { id, input }) => {
        let db
        let Project
        let teacher
        let update
        let error
        try {
            db = await connectDb()
            if (input.tittle == "") {
                error = [{ path: "Validacion", message: "El Titulo del proyecto no puede ir vacio" }]
                update = false
            }
            else if (input.description == "") {
                error = [{ path: "Validacion", message: "La descripcion del proyecto no puede ir vacio" }]
                update = false
            }
            else if (input.Horas == "") {
                error = [{ path: "Validacion", message: "La Hora del proyecto no puede ir vacio" }]
                update = false
            }
            else {
                Project = await db.collection('projects').updateOne(
                    { _id: ObjectId(id) },
                    { $set: input }
                )
                Project = await db.collection('projects').findOne({ _id: ObjectId(id) })
                update = true
            }

        } catch (error) {
            console.error(error);
        }
        return {
            Project,
            update,
            error
        }
    },
    delTeacher: async (root, { idCourse, idTeacher }) => {
        let db
        let course
        try {
            db = await connectDb()
            await db.collection('projects').updateOne(
                { _id: ObjectId(idCourse) },
                { $pull: { lider: idTeacher } }
            )
            await db.collection('Users').updateOne(
                {_id:ObjectId(idTeacher)},
                {$pull:{cursos:idCourse}}
            )
        } catch (error) {
            console.error(error);
        }
        return "El profesor ha sido eliminado"
    }
}