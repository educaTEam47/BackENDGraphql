'use strict'
const connectDb = require('./db')
const { ObjectId } = require('mongodb')
const connectDB = require('./db')

module.exports = {
    Course: {
        people: async ({ people }) => {
            let db
            let peopleData
            let names
            try {
                db = await connectDb()
                names = people ? people.map((nombres) => ObjectId(nombres)) : []
                //console.log(names)
                peopleData = names
                    ? await db.collection('student').find(
                        { _id: { $in: names } }
                    ).toArray() : []
            } catch (error) {
                console.error(error)
            }
            return peopleData
        },
        teacher:async({teacher})=>{
            let db
            let peopleData
            let names
            try {
                db = await connectDb()
                names = teacher ? teacher.map((nombres) => ObjectId(nombres)) : []
                //console.log(names)
                peopleData = names
                    ? await db.collection('teachers').find(
                        { _id: { $in: names } }
                    ).toArray() : []
            } catch (error) {
                console.error(error)
            }
            return peopleData
        }
    },
    Teacher: {
        curso: async ({ curso }) => {
            let db
            let data
            let ids
            try {
                db = await connectDb()
                ids = curso ? curso.map((cursos) => ObjectId(cursos)) : []        
                data = ids ?
                    await db.collection('courses').find(
                        { _id: { $in: ids } }
                    ).toArray() : []
            } catch (error) {
                console.error(error);
            }
            return data
        }
    },
    Student: {
        myCourses: async ({ myCourses }) => {
            let db
            let data
            let ids
            try {
                db = await connectDb()
                ids = myCourses ? myCourses.map((cursos) => ObjectId(cursos)) : []
                data = ids ?
                    await db.collection('courses').find(
                        { _id: { $in: ids } }
                    ).toArray() : []
            } catch (error) {
                console.error(error);
            }
            return data
        }
    }
}