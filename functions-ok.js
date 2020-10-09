const fs = require('fs')
const data = require('./src/db/data.json')

/*     ARRAYS     */

const alunos = [
  { nome: 'Everton', matricula: 111111, curso: 'ADS' },
  { nome: 'Pedro', matricula: 222222, curso: 'ADS' },
  { nome: 'Tiago', matricula: 3333333, curso: 'Biologia' },
  { nome: 'Fabricio', matricula: 444444, curso: 'Zootecnia' }, // MUDE O NOME DO CURSO AQUI
  { nome: 'Elias', matricula: 555555, curso: 'Formação Pedagógica' }, // MUDE O NOME DO CURSO AQUI
  { nome: 'Ronaldinho', matricula: 666666, curso: 'Biologia' }, // MUDE O NOME DO CURSO AQUI
  { nome: 'Lebrom James', matricula: 777777, curso: 'TAG' }, // MUDE O NOME DO CURSO AQUI
  { nome: 'Messi', matricula: 888888, curso: 'Gestão Ambiental' }, // MUDE O NOME DO CURSO AQUI
  { nome: 'Tom Brady', matricula: 999999, curso: 'TME' }
  // ADICIONE ALUNOS AQUI
]

/*     FUNÇÕES     */

function verCursos(cursos) {
  console.log('LISTA DE CURSOS')
  for (let i = 0; i < cursos.length; i++) {
    console.log(cursos[i])
  }
}


function verInscritos(inscritos) {
  console.log('LISTA DE INSCRITOS')
  for (let i = 0; i < inscritos.length; i++) {
    console.log(inscritos[i])
  }
}


async function populaCursos(alunos) {
  try {

    // Percorre todos os alunos da tabela ALUNOS
    for (const aluno of alunos) {

      // Procura na tabela cursos se o curso do aluno já está cadastrdo
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
        if (aluno.nome == alunoInscrito.nome) { 
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

function organizaDados(alunos) {
  populaCursos(alunos)
  // for (let i = 0; i < alunos.length; i++) {
    // const alunoCurso = 
    populaInscritosPorCurso(alunos)
  }
  // verCursos(cursos)
  // verInscritos(inscritos)




/*     EXECUÇÃO     */
organizaDados(alunos)



/*    PROBLEMAS    

[]duplincando os alunos no inscritos/cursos - ESTA CADASTRANDO NO CURSO CORRETO


*/