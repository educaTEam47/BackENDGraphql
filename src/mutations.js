'use strict'

const connectDb = require('./db')
const { ObjectId } = require('mongodb')
const connectDB = require('./db')
const bcrypt = require('bcrypt');

module.exports = {
    createCourse: async (root, { input }) => {
        const newCourse = Object.assign(input)
        let db
        let course
        try {
            db = await connectDb()
            course = await db.collection('courses').insertOne(newCourse)
            newCourse._id = course.insertedId
        } catch (error) {
            console.error(error)
        }
        return newCourse
    },
    createStudent: async (root, { input }) => {
        const newStudent = Object.assign(input)
        let db
        let student
        try {
            db = await connectDb()
            const saltos = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(newStudent.password, saltos);
            newStudent.password = password
            student = await db.collection('student').insertOne(newStudent)
            newStudent._id = student.insertedId
        } catch (error) {
            console.error(error)
        }
        return newStudent
    },
    createTeacher: async (root, { input }) => {
        const newTeacher = Object.assign(input)
        let db
        let teacher
        try {
            db = await connectDb()
            const saltos = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(newTeacher.password, saltos);
            newTeacher.password = password
            teacher = await db.collection('teachers').insertOne(newTeacher)
            newTeacher._id = teacher.insertedId
        } catch (error) {
            console.error(error);
        }
        return newTeacher
    },
    updateStudent: async (root, { id, input }) => {
        let db
        let student
        try {
            db = await connectDb()
            await db.collection('student').updateOne(
                { _id: ObjectId(id) },
                { $set: input }
            )
            student = await db.collection('student').findOne(
                { _id: ObjectId(id) }
            )
        } catch (error) {
            console.error(error);
        }
        return student
    },
    updateTeacher: async (root, { id, input }) => {
        let db
        let teacher
        try {
            db = await connectDb()
            await db.collection('teachers').updateOne(
                { _id: ObjectId(id) },
                { $set: input }
            )
            teacher = await db.collection('teachers').findOne(
                { _id: ObjectId(id) }
            )
        } catch (error) {
            console.error(error)
        }
        return teacher
    },
    updateCourse: async (root, { tittle, input }) => {
        let db
        let course
        try {
            db = await connectDb()
            await db.collection('courses').updateOne(
                { tittle: tittle },
                { $set: input }
            )
            course = await db.collection('courses').findOne(
                { tittle: tittle }
            )
        } catch (error) {
            console.error(error)
        }
        return course
    },
    deleteCourse: async (root, { tittle }) => {
        let db
        let course
        let message
        let search
        try {
            db = await connectDb()
            search = await db.collection('courses').findOne({ tittle: tittle })
            //console.log(search)
            if (search == null) {
                message = "El curso no existe"
            }
            else {
                course = await db.collection('courses').findOneAndDelete({ tittle: tittle })
                message = "El curso ha sido eliminado"
            }
        } catch (error) {
            console.error(error)
        }
        return message
    },
    deleteStudent: async (root, { id }) => {
        let db
        let search
        let message
        let student
        try {
            db = await connectDb()
            search = await db.collection('student').findOne({ _id: ObjectId(id) })
            console.log(search)
            if (search == null) {
                message = "El estudiante no se encuentra registrado"
            }
            else {
                student = await db.collection('student').findOneAndDelete({ _id: ObjectId(id) })
                message = "El estudiante ha sido eliminado"
            }
        } catch (error) {
            console.error(error)
        }
        return message
    },
    deleteTeacher: async (root, { id }) => {
        let db
        let search
        let message
        let teacher
        try {
            db = await connectDb()
            search = await db.collection('teachers').findOne({ _id: ObjectId(id) })
            console.log(search)
            if (search == null) {
                message = "El Profesor no se encuentra registrado"
            }
            else {
                teacher = await db.collection('teachers').findOneAndDelete({ _id: ObjectId(id) })
                message = "El Profesor ha sido eliminado"
            }
        } catch (error) {
            console.error(error)
        }
        return message
    },
    addPeople: async (root, { idCourse, idStudent }) => {
        let db
        let student
        let course
        let message
        try {
            db = await connectDb()
            course = await db.collection('courses').findOne({ _id: ObjectId(idCourse) })
            student = await db.collection('student').findOne({ _id: ObjectId(idStudent) })
            if (course == null) {
                console.log("El curso no existe")
                return "El curso no existe"
            }
            else if (student == null) {
                console.log("El estudiante no existe")
                return "El estudiante no existe"
            }
            else {
                await db.collection('courses').updateOne(
                    { _id: ObjectId(idCourse) },
                    { $addToSet: { people: idStudent } }
                )
                await db.collection('student').updateOne(
                    { _id: ObjectId(idStudent) },
                    { $addToSet: { myCourses: idCourse } }
                )
                console.log("Add")
                return course
            }
        } catch (error) {
            console.log(error)
        }
    },
    addTeacher: async (root, { idTeacher, idCurso }) => {
        let db
        let course
        let teacher
        try {
            db = await connectDb()
            course = await db.collection('courses').findOne({ _id: ObjectId(idCurso) })
            teacher = await db.collection('teachers').findOne({ _id: ObjectId(idTeacher) })
            //console.log(course)
            //console.log(teacher)
            if (course == null) {
                console.log("El curso no existe")
                return "El curso no existe"
            }
            else if (teacher == null) {
                console.log("El profesor no existe")
                return "El profesor no existe"
            }
            else {
                await db.collection('courses').updateOne(
                    { _id: ObjectId(idCurso) },
                    { $addToSet: { teacher: idTeacher } }
                )
                await db.collection('teachers').updateOne(
                    { _id: ObjectId(idTeacher) },
                    { $addToSet: { curso: idCurso } }
                )
                console.log("Add")
                return teacher
            }
        } catch (error) {
            console.error(error);
        }
    }
}