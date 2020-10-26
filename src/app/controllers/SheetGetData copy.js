const { getAuthToken, getSpreadSheetValues } = require('../config/googleSheetsService');
const { formatToObjetc } = require('../../lib/utils')
const estudantes = require('../../db/estudantes.json')
const fs = require('fs')



const spreadsheetId = '1U4l6wI3xhgg_RLOC_Sz6LsRi-0oXReJF_9iSgY2IDQg' // planilha-1
const sheetName = 'pagina1' // Da pra definir a planilha inteira: 'form1', ou um intervalo: 'form1!A:X'

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
      const inscritosObjetos = await formatToObjetc(inscritos)

      const resultado = { "estudantes": [] }
      for (k = 0; k < inscritosObjetos.length; k++) {
        resultado.estudantes.push(inscritosObjetos[k])
      }


      // Grava no arquivo JSON os dados do DATA
      fs.writeFile("./src/db/estudantes.json", JSON.stringify(resultado, null, 2), function (err) {
        if (err) return res.send("Write file error!")
      })




      res.status(200).json(inscritosObjetos)

    } catch (error) {
      console.log(error.message, error.stack);
    }
  },
}