const estudantes = require('./src/db/estudantes.json')
const fs = require('fs')



const data = [
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



var collection = data.slice(); // make a copy
var keys = collection.shift();

collection = collection.map(function (e) {
  var obj = {};

  keys.forEach(function (key, i) {
    obj[key] = e[i];
  });

  return obj;
});


for (k = 0; k < collection.length; k++) {
  estudantes.estudantes.push(collection[k])
  console.log(estudantes)
}

// Grava no arquivo JSON os dados do DATA
fs.writeFile("./src/db/estudantes.json", JSON.stringify(estudantes, null, 2), function (err) {
  if (err) return res.send("Write file error!")
})