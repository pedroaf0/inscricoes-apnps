const { getAuthToken, getSpreadSheetValues } = require('../config/googleSheetsService');
const { formatToObjetc } = require('../../lib/utils')
const fs = require('fs')
const inscritos = require('../../db/inscritos.json')
const cursos = require('../../db/cursos.json')
const inscritosPorCurso = require('../../db/inscritosPorCurso.json')


const spreadsheetId = '1Kj08CR3ryWjqehx4vE0d2pEW5D6zN1QfpfQ6oik0_YU' // planilha-1
const sheetName = 'Respostas ao formulário 1' // Da pra definir a planilha inteira: 'form1', ou um intervalo: 'form1!A:X'


module.exports = {

  async getDataInscritos(req, res) {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId,
        sheetName,
        auth
      })

      const alunos = response.data.values
      const inscritos = await formatToObjetc(alunos)

      for (let inscrito of inscritos) {

        for (let [key, value] of Object.entries(inscrito)) {
          if (value == '') {
            delete inscrito[key]
          } else {
            // Ajustar todas as colunas curso(?) para curso //poderia incluir no mesmo local?
            let filtro = key.includes('Curso')
            if (filtro) {
              inscrito.curso = value
              delete inscrito[key]
            }
          }

        }

      }

      // Grava no arquivo JSON os dados dos inscritos
      fs.writeFile("./src/db/inscritos.json", JSON.stringify(inscritos, null, 2), function (err) {
        if (err) return res.send("Write file error!")
      })


      res.status(200).json(inscritos)

    } catch (error) {
      console.log(error.message, error.stack);
    }
  },

  async populateCursos(req, res) {
    try {


      // Percorre todos os alunos da tabela INSCRITOS
      for (const inscrito of inscritos) {

        // Procura na tabela cursos se o curso do inscrito já está cadastrado
        let index = 0
        const foundInscritoCursoInCurso = cursos.cursos.find(function (curso, foundIndex) {
          if (inscrito.curso == curso.nome) {
            index = foundIndex
            return true
          }
        })

        if (!foundInscritoCursoInCurso) {
          console.log(inscrito.curso)
          cursos.cursos.push({ nome: inscrito.curso })
        }

      }

      // Grava no arquivo JSON os dados do DATA
      fs.writeFile("./src/db/cursos.json", JSON.stringify(cursos, null, 2), function (err) {
        if (err) return res.send("Write file error!")
      })





      res.status(200).json(cursos)



    } catch (error) {
      console.log(error.message, error.stack);

    }
  },
  async populateInscritosPorCurso(req, res) {
    try {

      // Percorre todos os cursos da tabela CURSOS
      const courses = cursos.cursos
      for (const course of courses) {

        /// Procura o curso no Inscritos{curso:[]}
        let index = 0
        const foundCursoInInscritosPorCurso = inscritosPorCurso.inscritos.find(function (inscrito, foundIndex) {
          if (course.nome == inscrito.curso) {
            index = foundIndex;
            return true;
          }
        })

        if (!foundCursoInInscritosPorCurso) {
          inscritosPorCurso.inscritos.push({ curso: course.nome, inscritos: [] })
          fs.writeFile("./src/db/inscritosPorCurso.json", JSON.stringify(inscritosPorCurso, null, 2), function (err) {
            if (err) return res.send("Write file error!")
          })
        }
      }

      const alunos = inscritos
      // Percorre todos os alunos da tabela INSCRITOS
      for (const aluno of alunos) {

        let index = 0

        // Pega index do curso cadastrado na tabela inscrito
        const foundInscritoCursoInInscritos = inscritosPorCurso.inscritos.find(function (inscrito, foundIndex) {
          if (aluno.curso == inscrito.curso) {
            index = foundIndex;
            return true;
          }
        })

        // Procura inscrito no index captura acima ( inscritos[index].inscritos)    //ERRO AQUI PQ COLUNAS NOMES ERRADOS
        const foundInscritoInCursosInscritos = inscritosPorCurso.inscritos[index].inscritos.find(function (inscrito) {
          if (aluno.nome == inscrito.nome && aluno.matricula == inscrito.matricula && aluno.curso == inscrito.curso) {
            // index2 = foundIndex
            return true;
          }
        })

        if (!foundInscritoInCursosInscritos) {
          inscritosPorCurso.inscritos[index].inscritos.push(aluno)
          fs.writeFile("./src/db/inscritosPorCurso.json", JSON.stringify(inscritosPorCurso, null, 2), function (err) {
            if (err) return res.send("Write file error!")
          })
        }
      }





      res.status(200).json(inscritosPorCurso)



    } catch (error) {
      console.log(error.message, error.stack);

    }
  }
}