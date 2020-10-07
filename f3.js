/*     ARRAYS     */

const alunos = [
    { nome: 'Everton', matricula: 111111, curso: 'Biologia' },
    { nome: 'Pedro', matricula: 222222, curso: 'ADS' },
    { nome: 'Tiago', matricula: 3333333, curso: 'Agronomia' },
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
          cursos.push({ nome: cursoAluno })
          inscritos.push({ curso: cursoAluno, alunos: [] })
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
          for (let y = 0; y < inscritos.length; y++) {
            if (aluno.curso == inscritos[y].curso) {
              inscritos[y].alunos.push(aluno)
            }
          }
          return true
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
//   organizaDados(alunos)


  let Arrayconvert = [
 [
    "Carimbo de data/hora",
    "Nome completo:",
    "CPF:",
    "Telefone para contato:",
    "Número de matrícula:",
    "E-mail para contato:",
    "Modalidade do seu curso:",
    "Curso: ",
    "Nome completo (pai, mãe ou responsável):",
    "Ano que está cursando atualmente:",
    "Turma:",
    "CPF (pai, mãe ou responsável):"
  ],
  [
    "04/09/2020 19:36:56",
    "Vitória Soares da Silva Oliveira",
    "03630841007",
    "54984035300",
    "0168190",
    "viihsoares876@gmail.com",
    "Técnico Integrado ao Ensino Médio",
    "Agronomia",
    "Sandra Soares da Silva",
    "1º ano",
    "13",
    "92685471049"
  ],
  [
    "04/09/2020 19:37:17",
    "Dionatan felipe scolari",
    "03706607069",
    "999842017",
    "0191205",
    "dfelipescolari@gmail.com",
    "Técnico Integrado ao Ensino Médio",
    "Agronegócios",
    "Luciano Roberto Scolari",
    "1º ano",
    "14",
    "91825903034"
  ],
  [
    "04/09/2020 19:37:17",
    "Francisco Cruz",
    "03706607069",
    "999842017",
    "0191205",
    "dfelipescolari@gmail.com",
    "Técnico Integrado ao Ensino Médio",
    "ADS",
    "Luciano Roberto Scolari",
    "3º ano",
    "18",
    "91825903034"
  ]
]
  
  
  function convertArrayToObjects(data) {
    var keys = data.shift(), 
        i = 0, k = 0,
        obj = null,
        output = [];
    for (i = 0; i < data.length; i++) {
        obj = {};
        for (k = 0; k < keys.length; k++) {
            obj[keys[k]] = data[i][k];
        }
        output.push(obj);
    }
    return output;
}

let dataTest = convertArrayToObjects(Arrayconvert)
console.log(typeof dataTest)
console.log(dataTest[1].CPF);
// console.log(dataTest[0].CPF)
// console.o
// // console.log(dataTest[0]);
// console.log(dataTest[1]);
// console.log(dataTest[2]);



