// ler dados das planilhas e jogar no json homologados
const { getAuthToken, getSpreadSheetValues} = require('../config/googleSheetsService');
const fs = require('fs')
// const { alunos } = require('../../db/homologados.json')
const { planilhas } = require('../../db/planilhas.json')


module.exports = {

    async getHomologados(req, res) {

        try {

            const auth = await getAuthToken();

            let spreadsheetId = ''
            const sheetName = 'Sheet1'

            for (let planilha of planilhas) {


                // console.log(planilha.id)
                spreadsheetId = planilha.id

                const response = await getSpreadSheetValues({
                    spreadsheetId,
                    sheetName,
                    auth
                })

                const homologados = response.data.values
                console.log('output for getSpreadSheetValues', JSON.stringify(homologados, null, 2));


                // transforma homologados em objeto

                // procura no JSON homolados se já tem o curso
                // usaro o planilha.curso == homologados.curso
                // ve se inscrito foi homologado (ou não)
                // salva no array correto

            }

            








           
            
            // const inscritos = response.data.values

            // console.log(planilhas) //remover
            // res.status(200).json(planilhas)


        } catch (error) {
            console.error(error); //remover
            res.status(200).json(error)
        }

















    }
}