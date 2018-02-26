
//creamos las rutas, primero debemos crear la ruta principal, lo realizamos en la carpeta routes, con app,js
var express = require('express');
var app = express();

//rutas primero la variable, luego la orden que queremos de la peticioen entre GET, POST, PUT, DELETE, 
//Get recibe tres paramtros request(solicitud), la respuesta y la orden Next para que siga adealante con la siguiente llamada. o funcion
//los next se utiliza sobretodo con los midelweares
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamentetttt'
    })
})

module.exports = app