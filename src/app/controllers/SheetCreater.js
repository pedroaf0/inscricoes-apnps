const { getAuthToken, getSpreadSheetValues, createSpreadSheet, updateSpreadSheetValues, moveSpreadSheet, changePermissionsSpreadSheet } = require('../config/googleSheetsService');
const { formatToObjetc, formatToArray } = require('../../lib/utils')
const fs = require('fs')
const data = require('../../db/data.json')


const spreadsheetId = '122wEhEpmtkN8cSNzoj50OQdumZtvoPcOvgZd5wFxuF8' // planilha-1
const sheetName = 'intro' // Da pra definir a planilha inteira: 'form1', ou um intervalo: 'form1!A:X'

const alunos = [
    { nome: 'Everton', matricula: 111111, curso: 'Biologia' },
    { nome: 'Pedro', matricula: 222222, curso: 'ADS' },
    { nome: 'Tiago', matricula: 3333333, curso: 'Agronomia' },
    { nome: 'Fabricio', matricula: 444444, curso: 'Zootecnia' }, 
    { nome: 'Elias', matricula: 555555, curso: 'Formação Pedagógica' },
    { nome: 'Ronaldinho', matricula: 666666, curso: 'Biologia' }, 
    { nome: 'Lebrom James', matricula: 777777, curso: 'TAG' }, 
    { nome: 'Messi', matricula: 888888, curso: 'Gestão Ambiental' }, 
]

const cursos = [
    // { nome: 'Biologia' },
    { nome: 'ADS' },
    // { nome: 'Agronomia' },
    // { nome: 'Zootecnia' },
    // { nome: 'Formação Pedagógica' },
    // { nome: 'TAG' },
    // { nome: 'Gestão Ambiental' },
]

const coordenadores = [
    { nome: 'Tiago Ferreira', email: 'pavaneverton@gmail.com', curso: 'ADS' },
    // { nome: 'Everton Pavan', email: 'everton.pavan.dev@gmail.com', curso: 'Biologia' }
]

module.exports = {

    async createSheetByCourse(req, res) {



        // const courses = cursos //acho que não precisa

        try {

            const criadas = []

            const createRequest = {
                title: ''
              }

            for (let curso of cursos) {

                createRequest.title = `${curso.nome} - Homologação`

                const auth = await getAuthToken();

                const createResponse = await createSpreadSheet({
                    auth,
                    createRequest
                })

                const idNewSpreadsheet = createResponse.data.spreadsheetId
                const urlNewSpreadsheet = createResponse.data.spreadsheetUrl

                // Mover planilha para pasta correta do Drive
                const moveRequest = {
                    folderId: '14KNHKofE-Ospjgk0-Pr1S8BDUL7lS1AR',
                    fileId: '',
                    fields: 'id, parents'
                  }
                  
                moveRequest.fileId = idNewSpreadsheet
                const moveResponse = await moveSpreadSheet({
                    auth,
                    moveRequest
                })
                console.log(`A planilha ${moveResponse.data.id} foi movida.`)

                
                // Dar permissões para os coordenadores de acordo com o curso
                const permissionsRequest = {
                    fileId: '',
                    role: 'writer',
                    type: 'user',
                    emailAddress: '',
                }

                permissionsRequest.fileId = idNewSpreadsheet
                var coordenadorSelecionado
                for (let coordenador of coordenadores) {
                    console.log(coordenador.email)
                    if (coordenador.curso == curso.nome ) {
                        // console.log(coordenador.email)
                        permissionsRequest.emailAddress = coordenador.email
                        // console.log(coordenador)
                        // console.log(coordenador.nome)
                        coordenadorSelecionado = coordenador.nome
                    }
                   
                }

                const responseChange = await changePermissionsSpreadSheet({
                    auth,
                    permissionsRequest
                });

                criadas.push({ nome: 
                    `${createRequest.title}`, 
                    coordenador: `${coordenadorSelecionado}` , 
                    email: `${permissionsRequest.emailAddress}` , 
                    id: idNewSpreadsheet, 
                    url: urlNewSpreadsheet 
                })

            }

            console.log(criadas) //remover
            res.status(200).json({ criadas }) 
            // return criadas 

        } catch (error) {
            console.error(error); //remover
            res.status(200).json(error)
        }
    },  
}



// mostrar msg qndo planilha não recebe coordenador
// salvar arrays em arquivos JSON