const cors = require('cors')
const routes = require("./src/app/routes")
const express = require('express')


const server = express()
server.use(routes)
server.use(cors())


server.listen(3000, function () {
    console.log("server is running")
})