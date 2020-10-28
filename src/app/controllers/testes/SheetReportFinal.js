const fs = require('fs')
const { inscritos } = require('../../db/homologados.json')
const { jsPDF } = require("jspdf");
// const { NOMEM } = require('dns');

// Pega dados do JSON homologados e gera PDF ( Por curso, separando homologados/não-homologados)

module.exports = {

    async runReports(req, res) {

        try {

            console.log(inscritos)

            // const doc =  new jsPDF({
            //     orientation: 'landscape',
            //     unit: 'cm',
            //     format: 'a4'
            // });

            // const titulo1 = "RESULTADO FINAL DAS INSCRIÇÕES HOMOLOGADAS NAS ATIVIDADES PEDAGÓGICAS NÃO PRESENCIAIS"
            // const titulo2 = "Edital do IFRS/Campus Sertão nº 27/2020"
            // const titulo3 = "CURSOS TÉCNICOS INTEGRADOS, CONCOMITANTE E SUBSEQUENTE AO ENSINO MÉDIO:"
            // const NomeDoCurso = 
            // doc.text(titulo1, 1, 1);
            // doc.text(titulo2, 1, 2);
            // doc.save("teste.pdf");


            //COLUNAS DO RELAOTIO : Nome, Turma, Resultado final da inscrição nas APNPs (Homologada)

            // Após tabelas: data ( lado direito), dados diretor (centralzados)

            const assinaturaDiretor = "Odair José Spenthof | Diretor-geral do Campus Sertão do IFRS | Portaria nº 160/2020"

            
            // TABELA NO PDF

            const headers = Object.keys(inscritos[0])
            console.log(headers)
            console.log(inscritos.length) // 7  cursos
            
          
            
            // for (i = 0; i < inscritos.length; i++) {
            // const valores = Object.values(inscritos.homologados[i])
            // console.log(valores)
            // }





            //   var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
            //   doc.table(1, 1, generateData(100), headers, { autoSize: true });



            //






            res.status(200).json(inscritos)

        } catch (error) {
            console.error(error); //remover
            res.status(200).json(error)
        }

    }

}

//http://raw.githack.com/MrRio/jsPDF/master/
//http://raw.githack.com/MrRio/jsPDF/master/docs/module-cell.html#~table