//Arracamaos el servidor como ||||  NODEMON ||||| para que este el node a la excucha y no tengamos que arrancar el proyecto todo el rato
//tenemos que definir en el packcage.json como queremos arrancar "start": "nodemon index.js",

//Requires : impotacios de librerias
var express = require('express');

// referenciamos mongoose
var mongoose = require('mongoose');

//conexiones a base de datos que parte de mongose
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    //con esta instruccion si ocurre un erro, se detiene todo con la accion del throw
    if(err) throw err;

    console.log('base de datos en 27017: \x1b[32m%s\x1b[0m' , 'online')

})



// inicializar variables
var app = express()

//rutas primero la variable, luego la orden que queremos de la peticioen entre GET, POST, PUT, DELETE, 
//Get recibe tres paramtros request(solicitud), la respuesta y la orden Next para que siga adealante con la siguiente llamada. o funcion
//los next se utiliza sobretodo con los midelweares

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamentetttt'
    })
})


//Escuchar peticiones
app.listen(3005, ()=> {
    console.log('Express serve corriendo el en puerto 3005: \x1b[32m%s\x1b[0m' , 'online')
});