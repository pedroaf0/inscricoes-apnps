const { getAuthToken, getSpreadSheetValues } = require('../config/googleSheetsService');
const { formatToObjetc } = require('../../lib/utils')
const fs = require('fs')

const spreadsheetId = '1GMswTxff-E9Iu4af7EfLEqE13RKjuFOCogwu9QN4zQ0' // planilha-1
const sheetName = 'AGR-CSO001-CLASSIFICACAO DE SOLOS-2020/1!A2:B41' // Da pra definir a planilha inteira: 'form1', ou um intervalo: 'form1!A:X'


module.exports = {

  async getSpreadSheetValues(req, res) {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId,
        sheetName,
        auth
      })

      const inscritos = response.data.values
      const homologados = await formatToObjetc(inscritos)

      for (let homologado of homologados) {

        for (let [key, value] of Object.entries(homologado)) {
          if (value == '') {
            delete homologado[key]
          } else {
            let filtro = key.includes('Disciplina')

            if (filtro) {
              homologado.Disciplinas = value
              delete homologado[key]
            }
          }
        }

      }

      

    



      res.status(200).json(homologados)

    } catch (error) {
      console.log(error.message, error.stack);
    }
  },
}