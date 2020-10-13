const { getAuthToken, createSpreadSheet, moveSpreadSheet, changePermissionsSpreadSheet } = require('../config/googleSheetsService');
const fs = require('fs')
const { cursos } = require('../../db/data.json')
const { alunos } = require('../../db/alunos.json')
const { coordenadores } = require('../../db/coordenadores.json')
const planilhas = require('../../db/planilhas.json')


const spreadsheetId = '122wEhEpmtkN8cSNzoj50OQdumZtvoPcOvgZd5wFxuF8' // planilha-1
const sheetName = 'intro' // Da pra definir a planilha inteira: 'form1', ou um intervalo: 'form1!A:X'



module.exports = {

    async createSheetByCourse(req, res) {

        try {

            const createRequest = {
                title: ''
            }

            const auth = await getAuthToken();

            for (let curso of cursos) {

                createRequest.title = `${curso.nome} - Homologação`
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

                // Dar permissões para os coordenadores de acordo com o curso
                const permissionsRequest = {
                    fileId: '',
                    role: 'writer',
                    type: 'user',
                    emailAddress: '',
                }

                permissionsRequest.fileId = idNewSpreadsheet
                var coordenadorSelecionado
                for (let coordenador of coordenadores) {  // substituir por find
                    if (coordenador.curso == curso.nome) {
                        permissionsRequest.emailAddress = coordenador.email
                        coordenadorSelecionado = coordenador.nome
                    }
                }

                const responseChange = await changePermissionsSpreadSheet({
                    auth,
                    permissionsRequest
                });

                planilhas.planilhas.push({
                    nome:
                        `${createRequest.title}`,
                    curso: `${curso.nome}`,
                    coordenador: `${coordenadorSelecionado}`,
                    email: `${permissionsRequest.emailAddress}`,
                    id: idNewSpreadsheet,
                    url: urlNewSpreadsheet
                })
            }
            // Grava no arquivo JSON os dados do criadas
            fs.writeFile("./src/db/planilhas.json", JSON.stringify(planilhas, null, 2), function (err) {
                if (err) return res.send("Write file error!")

            })

            console.log(planilhas) //remover
            res.status(200).json(planilhas)
            return planilhas 

        } catch (error) {
            console.error(error); //remover
            res.status(200).json(error)
        }
    }
}



// mostrar msg qndo planilha não recebe coordenador
// ler JSON planilha pra ve se ela já foi criadas
// se criar nova e deletar do json, remover do gdrive tbm