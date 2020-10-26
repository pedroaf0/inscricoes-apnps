const { getAuthToken, getSpreadSheetValues } = require('../config/googleSheetsService');
const { formatToObjetc } = require('../../lib/utils')
const fs = require('fs');
const { NOMEM } = require('dns');

const spreadsheetId = '1RBwe9prHcbhCnbzM_1E5B--iThIAGDeCMS2m_mTw4tg' // planilha-1
const sheetName = 'Respostas ao formulário 1' // Da pra definir a planilha inteira: 'form1', ou um intervalo: 'form1!A:X'

module.exports = {

  async getSpreadSheetValues(req, res) {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId,
        sheetName,
        auth
      })


      const naoHomologados = response.data.values
      const excluidos = await formatToObjetc(naoHomologados)


      for (let excluido of excluidos) {

        for (let [key, value] of Object.entries(excluido)) {
          if (value == '') {
            delete excluido[key]
          } else {
            let filtro = key.includes('Disciplina')

            if (filtro) {
              excluido.Disciplinas = value
              delete excluido[key]
            }
          }
        }

      }

      console.log(excluidos)

      res.status(200).json(excluidos)

    } catch (error) {
      console.log(error.message, error.stack);
    }
  },
}


/*
# ANOTAÇÕES:
[] Verificação se nome e matriculas foram preenchidos

*/