//Arracamaos el servidor como ||||  NODEMON ||||| para que este el node a la excucha y no tengamos que arrancar el proyecto todo el rato
//tenemos que definir en el packcage.json como queremos arrancar "start": "nodemon index.js",

//Requires : impotacios de librerias
var express = require('express');
// referenciamos mongoose
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// inicializar variables
var app = express()

// BODYPARSE configuracion, https://github.com/expressjs/body-parser, esto para tratar rapidamento los datos JSON
// Son peticiones que se ejcutan siempre, cuando pase por aqui, si viene algo en el body dela peticion, lo conviert e a JSON para que lo podamos tratar

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//conexiones a base de datos que parte de mongose
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    //con esta instruccion si ocurre un erro, se detiene todo con la accion del throw
    if(err) throw err;

    console.log('base de datos en 27017: \x1b[32m%s\x1b[0m' , 'online')

})

//Importar rutas
var appRoutes = require('./routes/app.route')
var userRoutes = require('./routes/usuario.route')
var loginRoutes = require('./routes/login.route')

//Rutas
//primero creamos un midelwear
app.use('/usuario', userRoutes)
app.use('/login', loginRoutes)
app.use('/', appRoutes)




//Escuchar peticiones
app.listen(3005, ()=> {
    console.log('Express serve corriendo el en puerto 3005: \x1b[32m%s\x1b[0m' , 'online')
});