const { getAuthToken, getSpreadSheetValues, createSpreadSheet, moveSpreadSheet, changePermissionsSpreadSheet, appendSpreadSheetValues } = require('../config/googleSheetsService');
const { formatToObjetc, changeSpaceToUnderline, organizeColumnCourse, deleteEmptyColumn, addColumnDisciplines } = require('../../lib/utils')
const fs = require('fs')
const inscritos = require('../../db/inscritos.json')
const cursos = require('../../db/cursos.json')
const inscritosPorCurso = require('../../db/inscritosPorCurso.json')
const coordenadores = require('../../db/coordenadores.json')
const planilhas = require('../../db/planilhas.json')
const disciplinas = require('../../db/disciplinas.json');
const { addListener } = require('process');
const { composer } = require('googleapis/build/src/apis/composer');




// const spreadsheetId = '1Kj08CR3ryWjqehx4vE0d2pEW5D6zN1QfpfQ6oik0_YU' // planilha-1
const spreadsheetId = '1OKVw0FeDCsz100eduidR0N6t6PR1hEU7kk-0-bpSVXs' // planilha-1

const sheetName = 'Respostas ao formulário 1' // Da pra definir a planilha inteira: 'form1', ou um intervalo: 'form1!A:X'


module.exports = {

  async getEnrollers(req, res) {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId,
        sheetName,
        auth
      })

      let inscritos = response.data.values
      // let inscritos = await formatToObjetc(alunos)
      inscritos = await formatToObjetc(inscritos)


      //Ver possibilidade de fazer todas essas funções em apenas uma
      inscritos = await deleteEmptyColumn(inscritos)
      inscritos = await organizeColumnCourse(inscritos)
      inscritos = await changeSpaceToUnderline(inscritos)
      inscritos = await addColumnDisciplines(inscritos)



      // Grava no arquivo JSON os dados dos inscritos
      fs.writeFile("./src/db/inscritos.json", JSON.stringify(inscritos, null, 2), function (err) {
        if (err) return res.send("Write file error!")
      })


      res.status(200).json(inscritos)

    } catch (error) {
      console.log(error.message, error.stack);
    }
  },

  async getCourses(req, res) {
    try {


      // Percorre todos os alunos da tabela INSCRITOS
      const alunos = inscritos
      for (const aluno of alunos) {

        // Procura na tabela cursos se o curso do inscrito já está cadastrado
        let index = 0
        const foundInscritoCursoInCurso = cursos.cursos.find(function (curso, foundIndex) {
          if (aluno.curso == curso.nome) {
            index = foundIndex
            return true
          }
        })

        if (!foundInscritoCursoInCurso) {
          console.log(aluno.curso)
          cursos.cursos.push({ nome: aluno.curso })
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

  async getEnrollersByCourse(req, res) {
    try {

      // Percorre todos os cursos da tabela CURSOS
      const courses = cursos.cursos
      for (const course of courses) {

        /// Procura o curso no Inscritos{curso:[]}
        let index = 0
        const foundCursoInInscritosPorCurso = inscritosPorCurso.inscritos.find(function (inscrito, foundIndex) {
          if (course.nome == inscrito.curso) {
            index = foundIndex;
            console.log(`Curso já cadastrado!`)
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

        // Procura inscrito no index capturado acima ( inscritos[index].inscritos)    //Pode dar erro aqui caso os nomes da colunas da planilha não correspondam aos atributos abaixo
        const foundInscritoInCursosInscritos = inscritosPorCurso.inscritos[index].inscritos.find(function (inscrito) {
          if (aluno.Nome_completo == inscrito.Nome_completo && aluno.Número_de_matrícula == inscrito.Número_de_matrícula && aluno.curso == inscrito.curso) {
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
  },

  async getDisciplinesByCourse(req, res) {
    try {

      // Percorre todos os cursos da tabela CURSOS
      const courses = cursos.cursos
      for (const course of courses) {

        /// Procura o curso na disciplinas:{curso:[]}
        let index = 0
        const foundCursoInDisicplines = disciplinas.disciplinas.find(function (disciplina, foundIndex) {
          if (course.nome == disciplina.curso) {
            index = foundIndex;
            return true;
          }
        })

        if (!foundCursoInDisicplines) {
          disciplinas.disciplinas.push({ curso: course.nome, disciplinas: [] })
          fs.writeFile("./src/db/disciplinas.json", JSON.stringify(disciplinas, null, 2), function (err) {
            if (err) return res.send("Write file error!")
          })
        }
      }

      const alunos = inscritos

      // Percorre todos os alunos da tabela INSCRITOS
      for (const aluno of alunos) {

        let index = 0

        // Pega index do curso cadastrado na tabela disciplina
        const foundCourseInDisciplines = disciplinas.disciplinas.find(function (disciplina, foundIndex) {
          if (aluno.curso == disciplina.curso) {
            index = foundIndex;
            return true;
          }
        })

        if (foundCourseInDisciplines) {
          // Verifica se disciplina já esta cadastrada no JSON disciplinas.disciplinas referene ao index do curso achado acima
          const foundEnrollerDisciplinesInDisciplines = disciplinas.disciplinas[index].disciplinas.find(function (disciplina) {
            console.log(`A disciplina: ${disciplina} já está cadastrada!`)
            return true
          })

          if (!foundEnrollerDisciplinesInDisciplines) {
            for (let i = 0; i <= aluno.disciplinas.length - 1; i++) {
              disciplinas.disciplinas[index].disciplinas.push(aluno.disciplinas[i])
            }

            fs.writeFile("./src/db/disciplinas.json", JSON.stringify(disciplinas, null, 2), function (err) {
              if (err) return res.send("Write file error!")

            })

          }
        }

      }

      res.status(200).json(disciplinas)

    } catch (error) {
      console.log(error.message, error.stack);

    }
  },

  async createSheetByCourse(req, res) {
    try {

      const auth = await getAuthToken();

      const courses = cursos.cursos

      for (let course of courses) {

        let createRequest = {
          title: '',
          sheets: []
        }

        createRequest.title = `${course.nome} - Homologação APNPs Dezembro/2020`

        // Procura na planilhas.json se a planilha já está inserida no json
        const foundPlanilhaInPlanilha = planilhas.planilhas.find(function (planilha) {
          if (createRequest.title == planilha.nome) {
            return true
          }
        })

        if (!foundPlanilhaInPlanilha) {

          disciplinas.disciplinas.map(function (disciplina) {
            if (course.nome == disciplina.curso) {
              let aux = []
              for (let i = 0; i <= disciplina.disciplinas.length - 1; i++) {
                aux.push({ properties: { title: disciplina.disciplinas[i] } })
              }

              createRequest.sheets.push(...aux)
            }
          })

          const createResponse = await createSpreadSheet({
            auth,
            createRequest
          })

          const idNewSpreadsheet = createResponse.data.spreadsheetId
          const urlNewSpreadsheet = createResponse.data.spreadsheetUrl

          // Mover planilha para pasta correta do Drive
          const moveRequest = {
            folderId: '14KNHKofE-Ospjgk0-Pr1S8BDUL7lS1AR',
            fileId: '',
            fields: 'id, parents'
          }

          moveRequest.fileId = idNewSpreadsheet
          const moveResponse = await moveSpreadSheet({
            auth,
            moveRequest
          })

          // Dar permissões para os coordenadores de acordo com o curso
          const permissionsRequest = {
            fileId: '',
            role: 'writer',
            type: 'user',
            emailAddress: '',
          }

          permissionsRequest.fileId = idNewSpreadsheet
          var coordenadorSelecionado
          // Procura no JSON coordenadores os cursos do JSON curso // Atenção aqui: os nomes do cursos nos jsons devem ser iguais
          const foundCourseInCoordenadores = coordenadores.coordenadores.find(function (coordenador) {
            if (coordenador.curso == course.nome) {
              permissionsRequest.emailAddress = coordenador.email
              coordenadorSelecionado = coordenador.nome
              return true
            }
          })

          if (!foundCourseInCoordenadores) {
            permissionsRequest.emailAddress = "ensino@teste.com"
            coordenadorSelecionado = "Sem coordenador!"
            console.log(`Não foi encontrado o curso: ${course.nome} na tabela de coordenadores!`)
          }

          const responseChange = await changePermissionsSpreadSheet({
            auth,
            permissionsRequest
          });

          planilhas.planilhas.push({
            nome:
              `${createRequest.title}`,
            curso: `${course.nome}`,
            coordenador: `${coordenadorSelecionado}`,
            email: `${permissionsRequest.emailAddress}`,
            id: idNewSpreadsheet,
            url: urlNewSpreadsheet
          })

        } else {
          console.log(`A planilha ${createRequest.title} já existe!`)
        }
      }

      // Grava no arquivo JSON planilhas os dados das planilhas geradas
      fs.writeFile("./src/db/planilhas.json", JSON.stringify(planilhas, null, 2), function (err) {
        if (err) return res.send("Write file error!")
      })

      res.status(200).json(planilhas)

    } catch (error) {
      console.log(error.message, error.stack);
    }
  },

  async populateSheetsWithEnrollersByCourse(req, res) {
    try {

      const auth = await getAuthToken();

      const sheets = planilhas.planilhas
      for (const sheet of sheets) {

        let index = 0
        const foundCourseSheetsInEnrollersByCourse = inscritosPorCurso.inscritos.find(function (inscritos, foundIndex) {
          if (sheet.curso == inscritos.curso) {
            index = foundIndex
            // console.log(inscritos.inscritos)
            return inscritos.inscritos
          }
        })

        if (foundCourseSheetsInEnrollersByCourse) {

          console.log(`INFORMAÇÕES DO CURSO: ${sheet.curso}`)

          console.log(`QUANTIDADE DE INSCRITOS NO CURSO: ${foundCourseSheetsInEnrollersByCourse.inscritos.length}`)
          for (i = 0; i < foundCourseSheetsInEnrollersByCourse.inscritos.length; i++) {
            console.log(`ALUNOOOOO`)
            console.log(foundCourseSheetsInEnrollersByCourse.inscritos[i].Nome_completo)

            // Dados que irão para a planilha - Cabeçalho + dados do inscrito
            const arrayEnrollerData = []
            // const headers = Object.keys(foundCourseSheetsInEnrollersByCourse.inscritos[0])
            // headers.push('HOMOLOGAÇÃO') // Adicione aqui caso queira adicionar mais colunas 
            // arrayEnrollerData.push(headers)

            const valores = Object.values(foundCourseSheetsInEnrollersByCourse.inscritos[i])
            valores.splice(valores.indexOf('disciplinas'), 1);
            arrayEnrollerData.push(valores)
            console.log(i)
            console.log(arrayEnrollerData)

            const disciplinaEnroller = foundCourseSheetsInEnrollersByCourse.inscritos[i].disciplinas

            // console.log(foundCourseSheetsInEnrollersByCourse.inscritos[i].Nome_completo)
            console.log(disciplinaEnroller)
            console.log(disciplinaEnroller.length)
            console.log(`--------------------------------------`)
          



            for (j = 0; j < disciplinaEnroller.length; j++) {
                  var appendOptions = {
                    spreadsheetId: sheet.id,
                    range: disciplinaEnroller[j],
                    valueInputOption: 'RAW',
                    insertDataOption: 'OVERWRITE',
                    resource:
                    {
                      majorDimension: 'ROWS',
                      values: arrayEnrollerData
                    },
                  }
                  console.log(appendOptions)

                  console.log(`--------------------------------------`)
                  response = await appendSpreadSheetValues({
                    auth,
                    appendOptions
                  })
            }

            

            
            ///QUASE SÓ INSERINDO OPRIMEIRO ALUNO CURSO
            console.log('PASSOU 1')

            // )




          }
        }

      }

      // res.status(200).json('Planilhas atualizadas com sucesso!')

    } catch (error) {
      console.log(error.message, error.stack);
    }
  },

}