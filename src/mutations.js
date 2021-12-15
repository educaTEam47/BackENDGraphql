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
                    user.Estado = "Desactivar"
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
            //console.log(searchusername)
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
                    rol: searchusername.rol,
                    email: searchusername.email,
                    Estado: searchusername.Estado
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
    createProject: async (root, {email, input }) => {
        let db
        let addproject
        let search
        let create
        let error
        let course
        const Project = Object.assign(input)
        //console.log(Project)
        //console.log(email)
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
                    //console.log(addproject)
                    Project._id = addproject.insertedId
                    //console.log(Project)
                    create = true
                    await db.collection('projects').updateOne(
                        { _id: Project._id },
                        { $addToSet: { lider: email } }
                    )
                    let idadd = Project._id.valueOf()
                    console.log(idadd)
                    course = await db.collection('projects').findOne({_id:Project._id})
                    await db.collection('Users').updateOne(
                        { email },
                        { $addToSet: { cursos: idadd } }
                    )
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
    updateUser: async (root, { email, input }) => {
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
            //console.log(id, input)
            search = await db.collection('Users').findOne({ email })
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
            if (typeof input.numidetificacion == 'number' || input.numidetificacion == null) {
                update = true
                await db.collection('Users').updateOne(
                    { email },
                    { $set: input }
                )
            }
            else {
                error = [{ path: "Validacion", message: "El numero de identificaion debe ser un numero" }]
            }
            user = await db.collection('Users').findOne({ email })
            //console.log(user)


        } catch (error) {
            console.error(error);
        }
        return {
            user,
            update,
            error
        }
    },
    addStudent: async (root, { email, idProject }) => {
        let db
        let project
        let student
        let add
        let error
        try {
            db = await connectDb()
            //console.log(idStudent,idProject)
            project = await db.collection('projects').findOne({ _id: ObjectId(idProject) })
            let filtro = project.people.filter(p => p === email)
            student = await db.collection('Users').findOne({ email })
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
                    if (filtro[0] === email) {
                        error = [{ path: "Validacion", message: "El correo ya se encuentra registrado" }]
                        add = false
                    }
                    else {
                        if(student.Estado==="Activar"){
                            await db.collection('Users').updateOne(
                                { email },
                                { $addToSet: { cursos: idProject } }
                            )
                            await db.collection('projects').updateOne(
                                { _id: ObjectId(idProject) },
                                { $addToSet: { people: email } }
                            )
                            add = true
                        }
                        else{
                            error=[{path:"Validate",message:"No puede agregar un estudiante que no ha sido activado"}]
                        }
                    }

                }
                else {
                    error = [{ path: "Validacion", message: "El email no corresponde a un Estudiante" }]
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
    addTeacher: async (root, { email, idProject }) => {
        let db
        let project
        let teacher
        let add
        let error
        let filtro
        try {
            console.log(idProject,email)
            db = await connectDb()
            if (email === "" || email === null) {
                error = [{ path: "Validacion", message: "Debe introducir un email" }]
            }
            else {
                project = await db.collection('projects').findOne({ _id: ObjectId(idProject) })
                console.log(project)
                //filtro = project.lider.filter(p => p === email)
                //console.log(filtro)
                teacher = await db.collection('Users').findOne({ email: email })
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
                    if (teacher.rol === "Lider") {
                        // if (filtro[0] === email) {
                        //     error = [{ path: "validacion", message: "El email ya se encuentra registrado" }]
                        //     add = false
                        // }
                        // else {
                            if(teacher.Estado==="Activar"){
                                await db.collection('Users').updateOne(
                                    { email },
                                    { $addToSet: { cursos: idProject } }
                                )
                                await db.collection('projects').updateOne(
                                    { _id: ObjectId(idProject) },
                                    { $addToSet: { lider: email } }
                                )
                                add = true
                            }
                            else{
                                error=[{path:"Validacion",message:"No puede agregar un Profesor desactivado"}]
                            }
                        //}
                    }
                    else {
                        error = [{ path: "Validacion", message: "El email presentado no corresponde a un profesor" }]
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
    delTeacher: async (root, { idCourse, email }) => {
        let db
        let course
        try {
            db = await connectDb()
            await db.collection('projects').updateOne(
                { _id: ObjectId(idCourse) },
                { $pull: { lider: email } }
            )
            await db.collection('Users').updateOne(
                { email: email },
                { $pull: { cursos: idCourse } }
            )
        } catch (error) {
            console.error(error);
        }
        return "El profesor ha sido eliminado"
    },
    delStudent: async (root, { idProject, email }) => {
        let db
        let course
        try {
            db = await connectDb()
            await db.collection('projects').updateOne(
                { _id: ObjectId(idProject) },
                { $pull: { people: email } }
            )
            await db.collection('Users').updateOne(
                { email },
                { $pull: { cursos: idProject } }
            )
        } catch (error) {
            console.error(error);
        }
        return "El estudiante ha sido eliminado"
    },
    validate: async (root, { token }) => {
        let id
        let nombres
        let rol
        let validacion
        let email
        let error
        let Estado
        //console.log(token)
        if (!token || token == "") {
            console.log("No hay Token")
            error = [{ path: "Validacion", message: "No tiene permiso" }]
            let validacion = false
        }
        else {
            try {
                const verificar = jwt.verify(token, process.env.TOKEN_SECRET)
                //console.log(verificar)
                id = verificar.id
                nombres = verificar.nombre
                rol = verificar.rol
                email = verificar.email
                Estado = verificar.Estado
                validacion = true
            } catch (error) {
                //error=[{path:"validacion", message:"El token no es valido"}]
                //let validacion= false
                console.error(error);
            }
        }
        return {
            id,
            email,
            nombres,
            rol,
            Estado,
            validacion,
            error
        }
    }
}