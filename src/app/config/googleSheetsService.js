// googleSheetsService.js

const { google } = require('googleapis');
const drive = google.drive('v3');
const sheets = google.sheets('v4');

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'
];


async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    // keyFile: './src/app/config/vault/subscription-for-1601063631396-4b84ce4e88f7.json',subscription-for-1601063631396-a5cd7a8f2a4d
    keyFile: './src/app/config/vault/subscription-for-1601063631396-a5cd7a8f2a4d.json',
    // keyFile: './src/app/config/vault/subscription-for-1601063631396-ec292a864fe9.json',
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function getSpreadSheet({ spreadsheetId, auth }) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

async function getSpreadSheetValues({ spreadsheetId, auth, sheetName }) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    // majorDimension: "ROWS",
    range: sheetName
  });
  return res;
}


async function copySpreadSheet({ auth, request }) {
  const res = await sheets.spreadsheets.sheets.copyTo({
    auth,
    spreadsheetId: request.spreadsheetId,
    sheetId: request.sheetId,
    destinationSpreadsheetId: request.destinationSpreadsheetId,
  });
  return res;
}



async function createSpreadSheet({ auth, createRequest }) {
  const res = await sheets.spreadsheets.create({
    auth,
    resource: {
      properties: {
        title: createRequest.title
      },
      sheets: createRequest.sheets     
    }
  });
  return res
}



async function appendSpreadSheetValues({auth, appendOptions}) {
  const res = await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId: appendOptions.spreadsheetId,
    range: appendOptions.range,
    valueInputOption: appendOptions.valueInputOption,
    insertDataOption: appendOptions.insertDataOption,
    resource: {
      range: appendOptions.resource.range2,
      majorDimension: appendOptions.resource.majorDimension,
      values: appendOptions.resource.values,
      
    }
  });
  return res;
}


async function updateSpreadSheetValues({ auth, updateOptions }) {
  const res = await sheets.spreadsheets.values.batchUpdate({
    auth,
    spreadsheetId: updateOptions.spreadsheetId,
      valueInputOption: updateOptions.valueInputOption,
      requests: [{
        updateCells: {
        range:
        {
          sheetId: updateOptions.sheetId,
          startRowIndex: updateOptions.startRowIndex,
          endRowIndex: updateOptions.endRowIndex,
          startColumnIndex: updateOptions.startColumnIndex,
          endColumnIndex: updateOptions.endColumnIndex,
        },
        rows: [{
          values: [
            {
              userEnteredFormat: {
                backgroundColor: {
                  red: updateOptions.red,
                  green: updateOptions.green,
                  blue: updateOptions.blue,
                }
              }
            }
          ]
        }],
           fields: updateOptions.fields 
          }
      } ]
  
    // }
  });
  return res;
}





// GOOGLE DRIVE API

async function moveSpreadSheet({ auth, moveRequest}) {
  const res = await drive.files.update({
    auth,
    fileId: moveRequest.fileId,
    addParents: moveRequest.folderId,
    fields: moveRequest.fields
  });
  return res
}

async function changePermissionsSpreadSheet({ auth, permissionsRequest }) {
  const res = await drive.permissions.create({
    auth,
    fileId: permissionsRequest.fileId,
    // transferOwnership: 'true',
    resource: {
      role: permissionsRequest.role,
      type: permissionsRequest.type,
      emailAddress: permissionsRequest.emailAddress
    }
  });
  return res
}

async function listDriveFiles({ auth, listRequest}) {
  const res = await drive.files.list({
    auth,
    corpora: listRequest.corpora,
    driveId: listRequest.fileId,
    includeItemsFromAllDrives: listRequest.includeItemsFromAllDrives,
    supportsAllDrives: listRequest.supportsAllDrives,
    q: listRequest.q
  });
  return res
}

async function deleteDriveFiles({ auth, deleteRequest}) {
  const res = await drive.files.delete({
    auth,
    fileId: deleteRequest.fileId,
    enforceSingleParent: deleteRequest.enforceSingleParent 
  });
  return res
}

async function emptyTrashDriveFiles({ auth }) {
  const res = await drive.files.emptyTrash({
    auth,
  });
  return res
}


module.exports = {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  createSpreadSheet,
  copySpreadSheet,
  appendSpreadSheetValues,
  updateSpreadSheetValues,
  moveSpreadSheet,
  changePermissionsSpreadSheet,
  listDriveFiles,
  deleteDriveFiles,
  emptyTrashDriveFiles
}
