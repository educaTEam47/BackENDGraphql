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
        },
        Horas:async()=>{
            let db
            let horas
            let data
            let teacher
            let cursosdata
            let idcursos
            let horaCurso
            try {
                db = await connectDb()
                teacher = await db.collection('teachers').find().toArray()
                //console.log(teacher)
                teacher.forEach(function(element){
                    data = element.curso
                })
                idcursos = data ? data.map((cursos)=> ObjectId(cursos)):[]
                //console.log(idcursos)
                cursosdata = idcursos ?
                    await db.collection('courses').find(
                        {_id: {$in: idcursos}}
                    ).toArray() :[]
                horas=0
                cursosdata.forEach(function(element){
                    horaCurso= element.Horas
                    horas = horas+horaCurso
                })
                //console.log(horas)
            } catch (error) {
                console.error(error);
            }
            return horas
        }
    },
    Student: {
        _id: async({_id})=>
            {
            global.id=_id
            return _id
        },
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
        },
        Horas:async()=>{
            let db
            let horas
            let data
            let student
            let cursosdata
            let idcursos
            let horaCurso
            try {
                db = await connectDb()
                student = await db.collection('student').find({_id:ObjectId(global.id)}).toArray()
                //console.log(student)
                //console.log(global.id)
                student.forEach(function(element){
                    data = element.myCourses
                })
                idcursos = data ? data.map((cursos)=> ObjectId(cursos)):[]
                //console.log(idcursos)
                cursosdata = idcursos ?
                    await db.collection('courses').find(
                        {_id: {$in: idcursos}}
                    ).toArray() :[]
                horas=0
                cursosdata.forEach(function(element){
                    horaCurso= element.Horas
                    horas = horas+horaCurso
                })
                //console.log(horas)
            } catch (error) {
                console.error(error);
            }
            return horas
        }
    }
}