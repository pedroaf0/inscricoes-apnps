module.exports = {

    async formatToObjetc(alunos) {

        const data = alunos
        var collection = data.slice(); // make a copy
        var keys = collection.shift();

        collection = collection.map(function (e) {
            var obj = {};

            keys.forEach(function (key, i) {
                obj[key] = e[i];
            });

            return obj;
        });

        const resultado = collection
        return resultado

    },
    async deleteEmptyColumn(inscritos) {
        for (let inscrito of inscritos) {
            for (let [key, value] of Object.entries(inscrito)) {
                if (value == '' || value == undefined || value == null) {
                    delete inscrito[key]
                }
            }
        }

        return inscritos
    },
    async organizeColumnCourse(inscritos) {

        for (let inscrito of inscritos) {
            for (let [key, value] of Object.entries(inscrito)) {
                let filtro = key.includes('Curso')
                if (filtro) {
                    curso = value
                    Object.assign(inscrito, { curso });
                    // console.log(key)
                    // console.log(value)
                    delete inscrito[key]
                }

            }

        }
        return inscritos
    },
    async changeSpaceToUnderline(inscritos) {

        for (let inscrito of inscritos) {
            for (let [key, value] of Object.entries(inscrito)) {

                let filtro = key.includes(' ')
                if (filtro) {

                    let oldKey = key

                    var i = 0, keyLength = key.length;
                    // console.log(keyLength)
                    for (i; i < keyLength; i++) {
                        key = key.replace(" ", "_");
                    }

                    inscrito[key] = value
                    delete inscrito[oldKey]
                }

            }
        }

        return inscritos
    },
    async addColumnDisciplines(inscritos) {

        for (let inscrito of inscritos) {

            var APNPs = []

            for (let [key, value] of Object.entries(inscrito)) {

                let filtroAPNPs = key.includes('APNPs')
                if (filtroAPNPs) {

                    let filtroValor = value.includes(',')
                    if (filtroValor) {
                        value = value.split(',')
                        for (let i = 0; i <= value.length - 1; i++) {
                            value[i] = value[i].trim()
                            APNPs.push(value[i])
                        } 
                    }else {
                        APNPs.push(value)
                    }
                }

                inscrito.disciplinas = APNPs

            }
        }
        // console.log(inscritos)
        return inscritos
    }

}

