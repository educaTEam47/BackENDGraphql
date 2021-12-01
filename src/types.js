'use strict'
const connectDb = require('./db')
const { ObjectId } = require('mongodb')

module.exports = {
    Course: {
        people: async ({ people }) => {
            let db
            let peopleData
            let names
            try {
                db = await connectDb()
                names = people ? people.map((nombres)=>nombres) :[]
                console.log(names)
                peopleData = names
                    ? await db.collection('student').find(
                        {nombres: { $in: names } }
                    ).toArray():[]
            } catch (error) {
                console.error(error)
            }
            return peopleData
        }
    },
    Teacher:{
        Curso: async({Curso})=>{
            let db
            let data
            try {
                db = await connectDb()
                data = await db.collection('courses').find(
                    {_id:ObjectId(Curso)}
                ).toArray()
                console.log(data)
            } catch (error) {
                console.error(error);
            }
            return data
        }
    }
}