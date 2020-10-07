module.exports = {

// formatToObjetc(inscritos) {
//     let attrs = inscritos[0];
//     // console.log(typeof attrs)
//     // console.log(attrs)
//     let allValues = inscritos.slice(1)
//     // console.log(allValues)
//     // let attr
//     let inscritosFormatados = allValues.map(values => {
//         let obj = {};
//         for (let i = 0; i < attrs.length; i++) {
//             attr = attrs[i];
//             // console.log(attrs[i])
//             // console.log(`ATTR: ${attr}`)
//             let value = values[i];
//             obj[attr] = value;
//         }
        
//         return obj;
        
//     });
//     return inscritosFormatados
// }

    async formatToObjetc(inscritos) {
        let attrs = inscritos[0]; // nomes dos campos
        let allValues = inscritos.slice(1) // dados
        let array = inscritos
        let obj = {};

        for (let i = 1; i < array.length; i++) {
            obj[`aluno_${i}`] = {};
            for (let b = 0; b < array[i].length; b++) {
                // console.log(`aluno_${i} ${array[0][i]} ${array[i][b]}`)
                obj[`aluno_${i}`][array[0][b]] = array[i][b];
            }
        }

        return obj

    }

}

