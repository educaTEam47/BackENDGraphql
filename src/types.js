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
                names = people ? people.map((nombres=>ObjectId(nombres))) :[]
                peopledata= names
                    ? await db.collection('Users').find({_id:{$in:names}}).toArray() :[]
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
                teachers = lider ? lider.map((teacher=>ObjectId(teacher))) : []
                liderdata =teachers
                    ? await db.collection('Users').find({_id: {$in:teachers}}).toArray():[]
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
    }
}