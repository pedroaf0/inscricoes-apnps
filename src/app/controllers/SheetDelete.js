const { getAuthToken, deleteDriveFiles, listDriveFiles } = require('../config/googleSheetsService');
const fs = require('fs')
const planilhas = require('../../db/planilhas.json')



module.exports = {

    async deleteAllSheets(req, res) {

        try {

            // acessar pasta do Drive e excluir todas as planilhas contidas no JSON planilhas
            const listRequest = {
                corpora: 'user',
                driveId: '14KNHKofE-Ospjgk0-Pr1S8BDUL7lS1AR',
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                q: "'me' in owners and (mimeType contains 'spreadsheet')" // title contains 'Homologação APNPs Dezembro/2020'

            }

            const auth = await getAuthToken();
            const response = await listDriveFiles({
                auth,
                listRequest
            })

            // console.log('output for listDriveFiles:', JSON.stringify(response.data.files, null, 2));

            const files = response.data.files

            for (i = 0; i < files.length; i++) {

                

                const fileSpreadsheetId = files[i].id

                const foundPlanilhaInPlanilha = planilhas.planilhas.find(function (planilha) {
                    if (fileSpreadsheetId == planilha.id) {
                        // console.log(files[i].id)
                        return true
                    }
                })


                if (foundPlanilhaInPlanilha) {
                    const deleteRequest = {
                        fileId: fileSpreadsheetId
                    }

                    const responseDelete = await deleteDriveFiles({
                        auth,
                        deleteRequest
                    })

                }
            }

            


            const data = { planilhas: [] }     

            // acessar JSON planilhas e excluir todos os itens
            fs.writeFile("./src/db/planilhas.json", JSON.stringify(data, null, 2), function (err) {
                if (err) return res.send("Write file error!")

            })

        }
        catch (error) {
            console.error(error); //remover
            res.status(200).json(error)
        }

        // console.log('Todas as planilhas foram excluídas!') //remover
        res.status(200).json('Todas as planilhas foram excluídas!')

    }
}

// excluir todas as sheets da pasta do drive
// pq serviço ta reiniciando qual deleta todas as planilhas?


