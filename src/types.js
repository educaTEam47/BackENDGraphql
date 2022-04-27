'use strict'
const connectDb = require('./db')
const { ObjectId } = require('mongodb')
const connectDB = require('./db')

module.exports = {
    Project:{
        people:async ({people})=>{
            let db 
            let peopledata
            let names
            try {
                db = await connectDb()
                names = people ? people.map((nombres=>nombres)) :[]
                peopledata= names
                    ? await db.collection('Users').find({email:{$in:names}}).toArray() :[]
                console.log(peopledata)
            } catch (error) {
                console.error(error);
            }
            return peopledata
        },
        lider: async ({lider})=>{
            let db
            let liderdata
            let teachers
            try {
                db = await connectDb()
                teachers = lider ? lider.map((teacher=>teacher)) : []
                liderdata =teachers
                    ? await db.collection('Users').find({email: {$in:teachers}}).toArray():[]
            } catch (error) {
                console.error(error);
            }
            return liderdata
        }
    },
    user:{
        cursos:async ({cursos})=>{
            let db
            let cursosdata
            let projects
            try {
                db = await connectDb()
                projects = cursos ? cursos.map((course=>ObjectId(course))): []
                cursosdata = projects
                    ? await db.collection('projects').find({_id:{$in:projects}}).toArray():[]
            } catch (error) {
                console.error(error);
            }
            return cursosdata
        }
    },
    notes:{
        project:async ({project})=>{
            let db
            let cursosdata
            let projects
            try {
                db = await connectDb()
                cursosdata = await db.collection('projects').findOne({_id:ObjectId(project)})
            } catch (error) {
                console.error(error);
            }
            return cursosdata
        },
        teacher: async ({teacher})=>{
            let db
            let liderdata
            let teachers
            try {
                db = await connectDb()
                liderdata = await db.collection('Users').findOne({email:teacher})
            } catch (error) {
                console.error(error);
            }
            return liderdata
        }
    }
}