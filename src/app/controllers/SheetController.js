const { getAuthToken, getSpreadSheetValues, createSpreadSheet, moveSpreadSheet, changePermissionsSpreadSheet, appendSpreadSheetValues } = require('../config/googleSheetsService');
const { formatToObjetc, changeSpaceToUnderline, organizeColumnCourse, deleteEmptyColumn, addColumnDisciplines } = require('../../lib/utils')
const fs = require('fs')
const inscritos = require('../../db/inscritos.json')
const cursos = require('../../db/cursos.json')
const inscritosPorCurso = require('../../db/inscritosPorCurso.json')
const coordenadores = require('../../db/coordenadores.json')
const planilhas = require('../../db/planilhas.json')
const disciplinas = require('../../db/disciplinas.json')




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

  } catch(error) {
    console.log(error.message, error.stack);
  }
},

  async getCourses(req, res) {
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





      // for (let i = 0; i <= aluno.disciplinas.length - 1; i++) {
      //   console.log(aluno.disciplinas[i])
      // }


      // Procura disciplina no index capturado acima ( disciplinas[index].disciplinas)    //Pode dar erro aqui caso os nomes da colunas da planilha não correspondam aos atributos abaixo
      // const foundEnrollerDisciplinesInDisciplines = disciplinas.disciplinas[index].disciplinas.find(function (disciplina) {

      // })



      // if (!foundEnrollerDisciplinesInDisciplines) {
      //   disciplinas.disciplinas[index].disciplinas.push(aluno.disciplinas)
      //   // fs.writeFile("./src/db/inscritosPorCurso.json", JSON.stringify(inscritosPorCurso, null, 2), function (err) {
      //   //   if (err) return res.send("Write file error!")
      //   // })

      // }

    }



    res.status(200).json(disciplinas)



  } catch (error) {
    console.log(error.message, error.stack);

  }
},


async createSheetByCourse(req, res) {
  try {

    const createRequest = {
      title: '',
      sheets: []
    }

    const auth = await getAuthToken();

    const courses = cursos.cursos

    for (let course of courses) {

      createRequest.title = `${course.nome} - Homologação APNPs Dezembro/2020`

      // Procura na planilhas.json se a planilha já está inserida no json
      const foundPlanilhaInPlanilha = planilhas.planilhas.find(function (planilha) {
        if (createRequest.title == planilha.nome) {
          return true
        }
      })

      // Jogar em array = todas as disciplinas do curso




      // adicionar as disciplinas no createRequest
















    }//remover


    /*
    
            if (!foundPlanilhaInPlanilha) {
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
    
    
    
              ///
    
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
    
          console.log(planilhas) //remover
          res.status(200).json(planilhas)
    
    */
  } catch (error) {
    console.log(error.message, error.stack);
  }
},

async populateSheetsWithEnrollersByCourse(req, res) {
  try {


    // let response = ''
    const sheets = planilhas.planilhas
    for (const sheet of sheets) {

      const foundSheetCourseInEnrollersByCourse = inscritosPorCurso.inscritos.find(function (inscritos, foundIndex) {
        if (sheet.curso == inscritos.curso) {
          index = foundIndex
          return inscritos
        }
      })

      const arrayAlunos = []

      const headers = Object.keys(foundSheetCourseInEnrollersByCourse.inscritos[0])
      headers.push('HOMOLOGAÇÃO')
      arrayAlunos.push(headers)



      for (i = 0; i < foundSheetCourseInEnrollersByCourse.inscritos.length; i++) {
        const valores = Object.values(foundSheetCourseInEnrollersByCourse.inscritos[i])

        // Verificar se inscrito já está na planilha



        arrayAlunos.push(valores)
      }



      const appendOptions = {
        spreadsheetId: sheet.id,
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'OVERWRITE',
        resource:
        {
          majorDimension: 'ROWS',
          values: arrayAlunos
        },
      }

      const auth = await getAuthToken();
      response = await appendSpreadSheetValues({
        auth,
        appendOptions
      })

    }

    res.status(200).json('Planilhas atualizadas com sucesso!')

  } catch (error) {
    console.log(error.message, error.stack);
  }
},

}