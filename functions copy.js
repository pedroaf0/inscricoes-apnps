const fs = require('fs')
const data = require('./src/db/data.json')

/*     ARRAYS     */

const alunos = [
  { nome: 'Everton', matricula: 111111, curso: 'Biologia' },
  { nome: 'Pedro', matricula: 222222, curso: 'ADS' },
  { nome: 'Tiago', matricula: 3333333, curso: 'Biologia' },
  { nome: 'Fabricio', matricula: 444444, curso: 'Zootecnia' }, // MUDE O NOME DO CURSO AQUI
  { nome: 'Elias', matricula: 555555, curso: 'Formação Pedagógica' }, // MUDE O NOME DO CURSO AQUI
  { nome: 'Ronaldinho', matricula: 666666, curso: 'Biologia' }, // MUDE O NOME DO CURSO AQUI
  { nome: 'Lebrom James', matricula: 777777, curso: 'TAG' }, // MUDE O NOME DO CURSO AQUI
  { nome: 'Messi', matricula: 888888, curso: 'Gestão Ambiental' }, // MUDE O NOME DO CURSO AQUI
  // ADICIONE ALUNOS AQUI
]

const cursos = []

const inscritos = []


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
    for (let i = 0; i < alunos.length; i++) {
      let existe = false
      let cursoAluno = alunos[i].curso

      for (let y = 0; y < cursos.length; y++) {
        // verifica se curso já existe
        if (alunos[i].curso == cursos[y].nome) {
          existe = true
        }
      }
      // se não existe no array cursos, é adicionado no array cursos e no inscritos
      if (existe == false) {
        data.cursos.push({ nome: cursoAluno })
        data.inscritos.push({ curso: cursoAluno, alunos: [] })

        cursos.push({ nome: cursoAluno })
        inscritos.push({ curso: cursoAluno, alunos: [] })


        fs.writeFile("./src/db/data.json", JSON.stringify(data, null, 2), function (err) {
          if (err) return res.send("Write file error!")
        })



      }
    }
  } catch (error) {
    console.error(error)
  }
}


function populaAlunosInscritosPorCurso(aluno) {
  try {
    for (let i = 0; i < cursos.length; i++) {
      if (aluno.curso == cursos[i].nome) {

        //
          



        //


        for (let y = 0; y < inscritos.length; y++) { // trocar por let inscrito os inscritos
          if (aluno.curso == inscritos[y].curso) { // remover
            inscritos[y].alunos.push(aluno) // remover

            /// Procura o curso no Inscritos{curso:[]}
            let index = 0
            const foundCursoInInscritos = data.inscritos.find(function (inscrito, foundIndex) {
              if (aluno.curso == inscrito.curso) {
                index = foundIndex
                return true
              }
            })

            if (!foundCursoInInscritos) return console.log("Curso não existe!") //testar isso

            const inscrito = {...aluno}

            // falt if pra ve se aluno já ta lá

            data.inscritos[index].alunos.push(inscrito)

            fs.writeFile("./src/db/data.json", JSON.stringify(data, null, 2), function (err) {
              if (err) return res.send("Write file error!")
            })

          }
        }
        return true //nao sei se precisa
      }
    }
  } catch (error) {
    console.error(error)
  }
}

function organizaDados(alunos) {
  populaCursos(alunos)
  for (let i = 0; i < alunos.length; i++) {
    const alunoCurso = populaAlunosInscritosPorCurso(alunos[i])
  }
  verCursos(cursos)
  verInscritos(inscritos)
}



/*     EXECUÇÃO     */
organizaDados(alunos)




// está duplicando as mesmas entradas de curso/inscritos(curso) - falta if