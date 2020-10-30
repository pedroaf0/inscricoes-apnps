const { getAuthToken, appendSpreadSheetValues } = require('../../config/googleSheetsService');
const data = require('../../db/data.json')
const { planilhas } = require('../../../db/planilhas.json')


module.exports = {

    async populateDataSheets(req, res) {

        try {

            let response = ''

            for (const planilha of planilhas) {

                const foundCoursePlanilhasInInscritos = data.inscritos.find(function (inscritos, foundIndex) {
                    if (planilha.curso == inscritos.curso) {
                        index = foundIndex
                        return inscritos
                    }
                })

                const arrayAlunos = []

                const headers = Object.keys(foundCoursePlanilhasInInscritos.alunos[0])
                headers.push('HOMOLOGAÇÃO') 
                arrayAlunos.push(headers)
               

                
                for (i = 0; i < foundCoursePlanilhasInInscritos.alunos.length; i++) {
                    const valores = Object.values(foundCoursePlanilhasInInscritos.alunos[i])
                    arrayAlunos.push(valores)
                }

                

                const appendOptions = {
                    spreadsheetId: planilha.id,
                    range: 'Sheet1',
                    valueInputOption: 'USER_ENTERED',
                    insertDataOption: 'OVERWRITE',
                    resource:
                    {
                        majorDimension: 'ROWS',
                        values: arrayAlunos
                    },
                }

                const auth = await getAuthToken();
                response = await appendSpreadSheetValues({
                    auth,
                    appendOptions
                })

               console.log('output for appendSpreadSheetValues', JSON.stringify(response, null, 2));
               console.log(`--------------------------------------------------------------`)

            }

            // criar um response de todas as planilhas atualizadas com id e data
            // console.log('output for appendSpreadSheetValues', JSON.stringify(response, null, 2));
            // res.status(200).json({ appendData: response }) 

            // res.status(200).json('Planilhas atualizadas com sucesso!')

        } catch (error) {
            console.error(error); //remover
            res.status(200).json(error)
        }

    }

}


// Verificar se dados já existem na planilha
// getspreadsheet.values
// comparar com array Alunos
// 