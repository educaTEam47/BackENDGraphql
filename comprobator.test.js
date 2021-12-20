const util = require('util');
const rp = require('request-promise');
const { exec } =require( 'child_process');
const pExec = util.promisify(exec);
const API = 'http://localhost:8000/';


describe('Obtener las notas para una ID de proyecto dado', () => {
    beforeAll(async () => {
    });

    it('Obtener las notas para una ID de proyecto dado', async () => {
        const query =`
        query{
        getNote(idProject:"61bbc3216798eb3c2ab32079"){
        notes {
          _id
          note
          description
          calificacion
        }
      }
    }
        `;

        const response = await rp({method: 'GET', uri: API, body: {query}, json: true});
        expect(response).toMatchSnapshot();
    });
});


describe('Obtener proyectos', () => {
    beforeAll(async () => {
    });

    it('Obtener todos los proyectos', async () => {
        const query =`
        query{
 	getUsers{

    nombres
    apellidos
    email
    Estado
    
  }
}
       
        `;

        const response = await rp({method: 'GET', uri: API, body: {query}, json: true});
        expect(response).toMatchSnapshot();
    });
});

describe('Obtener usuarios', () => {
    beforeAll(async () => {
    });

    it('Obtener todos los usuarios', async () => {
        const query =`
        query{
            getUsers{
       
           nombres
           apellidos
           email
           Estado
           
         }
       }
       
        `;

        const response = await rp({method: 'GET', uri: API, body: {query}, json: true});
        expect(response).toMatchSnapshot();
    });
});

describe('Obtener usuario real', () => {
    beforeAll(async () => {
    });

    it('Obtener usuario que existe', async () => {
        const query =`
        query{
            getUser(email:"daniel@admi.com"){
          user{
           nombres
           apellidos
           email
           Estado
          }
         }
       }
       
        `;

        const response = await rp({method: 'GET', uri: API, body: {query}, json: true});
        expect(response).toMatchSnapshot();
    });
});

describe('Obtener usuario falso', () => {
    beforeAll(async () => {
    });

    it('Obtener usuario que no existe', async () => {
        const query =`
        query{
            getUser(email:"destroymyproject@please.com"){
          user{
           nombres
           apellidos
           email
           Estado
          }
         }
       }
       
        `;

        const response = await rp({method: 'GET', uri: API, body: {query}, json: true});
        expect(response).toMatchSnapshot();
    });
});
