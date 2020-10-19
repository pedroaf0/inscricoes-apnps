const fs = require('fs')
const { inscritos } = require('../../db/homologados.json')

// Pega dados do JSON homologados e gera PDF ( Por curso, separando homologados/não-homologados)

module.exports = {

    async runReports(req, res) {

        try {

            console.log(inscritos)







            

            res.status(200).json(inscritos)

        } catch (error) {
            console.error(error); //remover
            res.status(200).json(error)
        }



    }

}