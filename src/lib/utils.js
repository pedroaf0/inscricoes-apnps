module.exports = {

    async formatToObjetc(inscritos) {

        const data  = inscritos
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

    }

}

