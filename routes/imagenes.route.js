var express = require('express');
var fs = require('fs');

var app = express();

// podrimamos insertar la llamada del TOEKN , exigir desde el front end que ese token exista para porporcionar las imagnes, 
// app.get('/:tipo/:img', :::::mdAuth.verificaToken::::: (req, res, next)

app.get('/:tipo/:img', (req, res, next) => {
    //priemro los params por la ruta
    var tipo = req.params.tipo;
    var img = req.params.img;
    // contruimos el path
    var path = `./uploads/${ tipo }/${ img }`;
    //de la libreria FILE SYSTEM, se pasa el path y te devuelve un callback, que en este caso es existe
    fs.exists(path, existe => {
        // Si no existe una imagen por defecto
        if (!existe) {
            path = './assets/no-img.jpg';
        }

        res.sendfile(path);
    });

});

module.exports = app;