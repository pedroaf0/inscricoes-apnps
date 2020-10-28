const express = require('express')
const SheetControllerTests = require('../controllers/SheetControllerTests')
const SheetController = require('../controllers/SheetController')

// const SheetCreater = require('../controllers/SheetCreater')
// const SheetDelete = require('../controllers/SheetDelete')
// const SheetGetAlunosExclusao = require('../controllers/SheetGetAlunosExclusao')
// const SheetGetHomologados = require('../controllers/SheetGetHomologados')
// const SheetPopulateData = require('../controllers/SheetPopulateData')
// const SheetReportFinal = require('../controllers/SheetReportFinal')

const routes = express.Router()

// routes.get('/inscritos', SheetController.testGetSpreadSheet)
// routes.get('/inscritos', SheetController.testGetSpreadSheetValues)
// routes.get('/inscritos', SheetController.testCopySpreadSheet)
// routes.get('/inscritos', SheetController.testCreateSpreadSheet)
// routes.get('/inscritos', SheetController.testMoveSpreadSheet)
// routes.get('/inscritos', SheetController.testChangePermissionsSpreadSheet)
// routes.get('/inscritos', SheetController.testAppendSpreadSheetValues)
// routes.get('/inscritos', SheetController.testUpdateSpreadSheetValues)
// routes.get('/inscritos/list', SheetController.testListDriveFiles)
// routes.get('/inscritos/delete', SheetController.testDeleteDriveFiles)
// routes.get('/inscritos/emptytrash', SheetController.testEmptyTrashDriveFiles)


// routes.get('/inscritos/create', SheetCreater.createSheetByCourse)
// routes.get('/inscritos/populate', SheetPopulateData.populateDataSheets)
// routes.get('/inscritos/delete', SheetDelete.deleteAllSheets)
// routes.get('/inscritos/homologados', SheetGetHomologados.getHomologados)
// routes.get('/inscritos/relatorios', SheetReportFinal.runReports)
// routes.get('/inscritos/excluir', SheetGetAlunosExclusao.getSpreadSheetValues)

routes.get('/inscritos', SheetController.getDataInscritos)
routes.get('/cursos', SheetController.populateCursos)
routes.get('/inscritos-por-curso', SheetController.populateInscritosPorCurso)

















module.exports = routes