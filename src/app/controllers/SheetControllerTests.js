const { getAuthToken, getSpreadSheet, getSpreadSheetValues, createSpreadSheet, copySpreadSheet, appendSpreadSheetValues, updateSpreadSheetValues, moveSpreadSheet, changePermissionsSpreadSheet, listDriveFiles, deleteDriveFiles, emptyTrashDriveFiles} = require('../config/googleSheetsService');
const { formatToObjetc, formatToArray } = require('../../lib/utils')
// const spreadsheetId = '1tMXZvenMCGtcG3hRb_LcFcHAtfYgUs-xd5nw3YjWN-8'
// const sheetName = 'integrado' // Da pra definir a planilha inteira: 'form1', ou um intervalo: 'form1!A:X'

const spreadsheetId = '122wEhEpmtkN8cSNzoj50OQdumZtvoPcOvgZd5wFxuF8' // planilha-1
const sheetName = 'intro' // Da pra definir a planilha inteira: 'form1', ou um intervalo: 'form1!A:X'


// // Informações para copySpreadSheet
const request = {
  spreadsheetId: '1tMXZvenMCGtcG3hRb_LcFcHAtfYgUs-xd5nw3YjWN-8',
  sheetId: 0,
  destinationSpreadsheetId: '1lSH4xIX754ilk1Kqo_0iUZVgvmPvYWjl8DsJOa_zpkY', // Planilha-2
  field: 'destinationSpreadsheetId'
}

const createRequest = {
  title: 'CriadaPlanilha ',
  sheets: [
    {
      properties: {
        title: 'DICIPLINA-1'
      }
    },
    {
      properties: {
        title: '20-PLANILHA'
      }
    }
  ]
}

// 

module.exports = {

  async testGetSpreadSheet(req, res) {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheet({
        spreadsheetId,
        auth
      })

      console.log('output for getSpreadSheet', JSON.stringify(response.data, null, 2));
      res.status(200).json(response)


    } catch (error) {
      console.log(error.message, error.stack);
    }

  },
  async testGetSpreadSheetValues(req, res) {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId,
        sheetName,
        auth
      })
      // console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
      const inscritos = response.data.values


      console.log(typeof inscritos) 
      // const formatedData = await formatToObjetc(inscritos)
      // console.log(formatedData)
      


      console.log(inscritos)
      res.status(200).json(inscritos)

    } catch (error) {
      console.log(error.message, error.stack);
    }
  },

  async testCopySpreadSheet(req, res) {
    try {
      const auth = await getAuthToken();
      const response = await copySpreadSheet({
        auth,
        request,
      })
      // console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
      const idDestination = response.config.params.destinationSpreadsheetId
      const urlDestination = `https://docs.google.com/spreadsheets/d/${idDestination}`
      res.status(200).json({ Planilha_copiada: urlDestination })
      console.log(urlDestination)

    } catch (error) {
      console.log(error.message, error.stack);
    }
  },



  async testCreateSpreadSheet(req, res) {
    try {

      const auth = await getAuthToken();
      
      const response = await createSpreadSheet({
        auth,
        createRequest
      })
      console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
      const idNewSpreadsheet = response.data.spreadsheetId
      const urlNewSpreadsheet = response.data.spreadsheetUrl

      res.status(200).json({ urlNewSpreadsheet: urlNewSpreadsheet, idNewSpreadsheet: idNewSpreadsheet }) // Não sei onde ela ta sendo criada(pasta)
      return idNewSpreadsheet
    res.status(200).json({ urlNewSpreadsheet: urlNewSpreadsheet, idNewSpreadsheet: idNewSpreadsheet }) // Não sei onde ela ta sendo criada(pasta)
     return idNewSpreadsheet
    
    } catch (error) {
      console.log(error.message, error.stack);
    }
  },


  async testAppendSpreadSheetValues(req, res) {
    try {

      const appendOptions = {
        spreadsheetId: '1lSH4xIX754ilk1Kqo_0iUZVgvmPvYWjl8DsJOa_zpkY',
        range: 'intro!F1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'OVERWRITE',
        resource: {
          // range2: 'intro!F1:F50',
          majorDimension: 'COLUMNS',
          values: [
            ['HOMOLOGAÇÃO' ]
          ]
        }
      }

      const auth = await getAuthToken();
      const response = await appendSpreadSheetValues({
        auth,
        appendOptions
      })

      console.log('output for appendSpreadSheetValues', JSON.stringify(response.data, null, 2));
      res.status(200).json({ appendData: response }) 
    } catch (error) {
      console.log(error.message, error.stack);
    }
  },


  async testUpdateSpreadSheetValues(req, res) {
    try {

      // const updateOptions = {
      //   spreadsheetId: '1lSH4xIX754ilk1Kqo_0iUZVgvmPvYWjl8DsJOa_zpkY',
      //     valueInputOption: 'USER_ENTERED',
      //     requests: [{
      //       updateCells: {
      //       range: 
      //         {
      //           sheetId: 0,
      //           startRowIndex: 6,
      //           endRowIndex: 10,
      //           startColumnIndex: 0,
      //           endColumnIndex: 12,
      //         },
      //         rows: [{
      //           values: [
      //             {
      //               userEnteredFormat: {
      //                 backgroundColor: {
      //                   red: 75,
      //                   green: 63,
      //                   blue: 25
      //                 }
      //               }
      //             }
      //           ]
      //         }],
      //            fields: 'userEnteredValue'
      //       }    
      //       } ]           
      // }


      const updateOptions = {
        spreadsheetId: '1lSH4xIX754ilk1Kqo_0iUZVgvmPvYWjl8DsJOa_zpkY',
        valueInputOption: 'USER_ENTERED',
        sheetId: 0,
        startRowIndex: 6,
        endRowIndex: 10,
        startColumnIndex: 0,
        endColumnIndex: 12,
        red: 23232,
        green: 223,
        blue: 2321,
        fields: 'userEnteredValue'
      }

      
      const auth = await getAuthToken();
      const response = await updateSpreadSheetValues({
        auth,
        updateOptions
      })
      console.log(updateOptions),


      console.log('output for updateSpreadSheetValues', JSON.stringify(response.data, null, 2));
      res.status(200).json({ appendData: response })
    } catch (error) {
      console.log(error.message, error.stack);
    }
  },



// GOOGLE DRIVE API

  async testMoveSpreadSheet(req, res) {
    const moveRequest = {
      folderId: '14KNHKofE-Ospjgk0-Pr1S8BDUL7lS1AR',
      fileId: '1mu7fDaLoZoijze3GYA-YfZr53JoHZB4zNo19iyHOA6k',
      fields: 'id, parents'
    }
    try {
      const auth = await getAuthToken();
      const response = await moveSpreadSheet({
        auth,
        moveRequest
        
      })
      console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
      res.status(200).json({ moveSpreadSheet: response.data }) // Não sei onde ela ta sendo criada(pasta)
    } catch (error) {
      console.log(error.message, error.stack);
    }
  },

  async TestChangePermissionsSpreadSheet(req, res) {
    const permissionsRequest = {
      fileId: '1mu7fDaLoZoijze3GYA-YfZr53JoHZB4zNo19iyHOA6k',
      role: 'writer',
      type: 'user',
      emailAddress: 'cti@sertao.ifrs.edu.br',
    }
    try {
      const auth = await getAuthToken();
      const response = await changePermissionsSpreadSheet({
        auth,
        permissionsRequest
      });
      console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
      res.status(200).json({ moveSpreadSheet: response.data }) // Não sei onde ela ta sendo criada(pasta)
    } catch (error) {
      console.log(error.message, error.stack);
    }
  },

  // https://developers.google.com/drive/api/v2/search-files
  async testListDriveFiles(req, res) {
    const listRequest = {
      corpora: 'user',
      driveId: '14KNHKofE-Ospjgk0-Pr1S8BDUL7lS1AR',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      q: "'me' in owners and (mimeType contains 'spreadsheet')" // title contains 'Homologação APNPs Dezembro/2020'

    }
    try {
      const auth = await getAuthToken();
      const response = await listDriveFiles({
        auth,
        listRequest
        
      })
      // console.log('output for listDriveFiles:', JSON.stringify(response.data.files, null, 2));

      // utilizar quando quiser deletar todos os arquivos do usuario
      // const files = response.data.files

      // for (i = 0; i < files.length; i++) {

      //   console.log(files[i].id)

      //   const deleteRequest = {
      //     fileId: files[i].id
      //   }

      //   const response = await deleteDriveFiles({
      //           auth,
      //           deleteRequest
      //   })
      // }
      
      
      

      res.status(200).json({ listDriveFiles: response.data.files }) 
    } catch (error) {
      console.log(error.message, error.stack);
    }
  },

  async testDeleteDriveFiles(req, res) {
    const deleteRequest = {
      fileId: '1JMtQqVX_5F5VWAabLelOGr-0sb7MJPUUcE_h6FhrEVY',
      // enforceSingleParent: true
    }
    try {
      const auth = await getAuthToken();
      const response = await deleteDriveFiles({
        auth,
        deleteRequest
      })
      console.log('output for deleteDriveFiles:', JSON.stringify(response, null, 2));
      res.status(200).json({ deleteDriveFiles: response }) 
    } catch (error) {
      console.log(error.message, error.stack);
    }
  },

  async testEmptyTrashDriveFiles(req, res) {
    try {
      const auth = await getAuthToken();
      const response = await emptyTrashDriveFiles({
        auth,
      })
      console.log('output for emptyTrashDriveFiles:', JSON.stringify(response.data, null, 2));
      res.status(200).json({ deleteDriveFiles: response.data }) 
    } catch (error) {
      console.log(error.message, error.stack);
    }
  },



} //end module.exports


/*
[ ] Criar lista de todos os (ids dos) files na pasta
[ ] Se tiver na pasta ( com o nome curso -homologação - dez 2020 ) e não tiver na planilha - excluir!
[ ] 


*/