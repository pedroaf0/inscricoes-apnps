const fs = require('fs')
const data = require('./src/db/data.json')
const { alunos } = require('./src/db/alunos.json')

/*     FUNÇÕES     */
async function populaCursos(alunos) {
  try {

    // Percorre todos os alunos da tabela ALUNOS
    for (const aluno of alunos) {

      // Procura na tabela cursos se o curso do aluno já está cadastrado
      let index = 0
      const foundAlunoCursoInCurso = data.cursos.find(function (curso, foundIndex) {
        if (aluno.curso == curso.nome) {
          index = foundIndex
          return true
        }
      })

      if (!foundAlunoCursoInCurso) {
        data.cursos.push({ nome: aluno.curso })
      }

    }

    // Grava no arquivo JSON os dados do DATA
    fs.writeFile("./src/db/data.json", JSON.stringify(data, null, 2), function (err) {
      if (err) return res.send("Write file error!")
    })

  } catch (error) {
    console.error(error)
  }
}

function populaInscritosPorCurso(aluno) {
  try {

    // Percorre todos os cursos da tabela CURSOS
    const { cursos } = data
    for (const curso of cursos) {

      /// Procura o curso no Inscritos{curso:[]}
      let index = 0
      const foundCursoInInscritos = data.inscritos.find(function (inscrito, foundIndex) {
        if (curso.nome == inscrito.curso) {
          index = foundIndex
          return true
        }
      })

      if (!foundCursoInInscritos) {
        data.inscritos.push({ curso: curso.nome, alunos: [] })
        fs.writeFile("./src/db/data.json", JSON.stringify(data, null, 2), function (err) {
          if (err) return res.send("Write file error!")
        })
      }
    }


    // Percorre todos os alunos da tabela ALUNOS
    for (const aluno of alunos) {

      let index = 0

      // Pega index do curso cadastrado na tabela inscrito
      const foundAlunoCursoInInscritos = data.inscritos.find(function (inscrito, foundIndex) {
        if (aluno.curso == inscrito.curso) {
          index = foundIndex
          return true
        }
      })

      // Procura aluno no index captura acima ( inscritos[index].alunos)    
      const foundAlunoInCursosInscritos = data.inscritos[index].alunos.find(function (alunoInscrito) {
        if (aluno.nome == alunoInscrito.nome && aluno.matricula == alunoInscrito.matricula && aluno.curso == alunoInscrito.curso) {
          // index2 = foundIndex
          return true
        }
      })

      if (!foundAlunoInCursosInscritos) {
        data.inscritos[index].alunos.push(aluno)
        fs.writeFile("./src/db/data.json", JSON.stringify(data, null, 2), function (err) {
          if (err) return res.send("Write file error!")
        })
      }
    }



  } catch (error) {
    console.error(error)
  }
}

async function organizaDados(alunos) {
  await populaCursos(alunos)
  await populaInscritosPorCurso(alunos)
}


/*     EXECUÇÃO     */
organizaDados(alunos)