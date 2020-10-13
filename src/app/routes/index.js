const express = require('express')
const SheetController = require('../controllers/SheetController')
const SheetCreater = require('../controllers/SheetCreater')
const SheetPopulateData = require('../controllers/SheetPopulateData')
const routes = express.Router()

// Lista de inscritos
// routes.get('/inscritos', SheetController.testGetSpreadSheet)
routes.get('/inscritos', SheetController.testGetSpreadSheetValues)
// routes.get('/inscritos', SheetController.testCopySpreadSheet)
// routes.get('/inscritos', SheetController.testCreateSpreadSheet)
// routes.get('/inscritos', SheetController.testMoveSpreadSheet)
// routes.get('/inscritos', SheetController.testChangePermissionsSpreadSheet)
// routes.get('/inscritos', SheetController.testAppendSpreadSheetValues)
// routes.get('/inscritos', SheetController.testUpdateSpreadSheetValues)


routes.get('/inscritos/create', SheetCreater.createSheetByCourse)
routes.get('/inscritos/populate', SheetPopulateData.populateDataSheets)







module.exports = routes