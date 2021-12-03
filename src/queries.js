'use strict'
const connectDb = require('./db')
const { ObjectId } = require('mongodb')

module.exports = {
    getCourses: async () => {
        let db
        let courses
        try {
            db = await connectDb()
            courses = await db.collection('courses').find().toArray()
        } catch (error) {
            console.error(error);
        }
        return courses
    },
    getTeacher:async(root,{id})=>{
        let db
        let teacher
        try {
            db= await connectDb()
            teacher= await db.collection('teachers').findOne(
                {_id:ObjectId(id)}
            )
        } catch (error) {
            console.error(error);
        }
        return teacher
    },
    getTeachers: async()=>{
        let db
        let teachers
        try {
            db= await connectDb()
            teachers = await db.collection('teachers').find().toArray()
        } catch (error) {
            console.error(error);
        }
        return teachers
    },
    getCourse: async (root, { id }) => {
        let db
        let course
        try {
            db = await connectDb()
            course = await db.collection('courses').findOne({ _id: ObjectId(id) })
        }
        catch (error) {
            console.error(error)
        }
        return course
    },
    getStudents: async () => {
        let db
        let students
        try {
            db = await connectDb()
            students = await db.collection('student').find().toArray()
        } catch (error) {
            console.error(error)
        }
        return students
    },
    getStudent: async (root,{idStudent})=>{
        let db
        let student
        try{
            db = await connectDb()
            student = await db.collection('student').findOne({_id:ObjectId(idStudent)})
        }catch(error){
            console.error(error)
        }
        return student
    }
}