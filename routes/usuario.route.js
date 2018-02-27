const express = require('express');
//para encriptar la contraseña, 
const bcrypt = require('bcryptjs');
//Para crear los token unicons 
const jwt = require('jsonwebtoken');

//importamos la funcion que verifica el token
const mdAuth = require('../middlewares/auth.middleware');

//arracamaos express y con ello toso sus metodos, get, put, delete, etc
const app = express();

//debemos importar lo primero nuestro modelo de usuario
const Usuario = require('../models/usuario.model');


// ==========================
// Obtener todos los usuarios
// ==========================
app.get('/', (req, res, next) => {
    //debido a mongoose, ya tenemos todo los metodos necesario para realizar una busqueda en nuenstra base de datod de MONGO DB en este caso es un GET asi qeu realizamos un FIND y le pasamos un objeto. y una funcion de callback que recibe dos parametros

    //para enla respuetsa no devolder el password aqui pasamos como segundo parametro la lista de los parametros que queremos devolver en este caso el ejemplo es : 'nombre email img role', luego la segunda funcion el exec para ya hacer la peticion
    //Esto para 
    var desde = req.query.desde || 0;
    desde = Number(desde);
    
    Usuario.find({}, 'nombre email img role')
    //SKIP (mongose)sirvedesde donde empieza a contar
    .skip(desde)
    //LIMIT (mongose)sirve para la cantidad total de la cual
    .limit(5)
    .exec(
        (err, usuarios) => {
            if (err) {
                //error BBDD
                return res.status(500).json({
                    ok: false,
                    mensaje: 'ERROR de carga de usuarios',
                    errors: err
                });
            }
            //COUNT (mongose)sirve para contar la cantida del registros, entre lñas llaves{} se podria pasar parametros

            Usuario.count({}, (err, conteo)=>{
                if (err) {
                    //error BBDD
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'ERROR de contar Usuariozs',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });
            })
        }
    );
});



// ==========================
// Actualizar un usuario
// ==========================

//tenemos que mandar el ID del usuario que queremos modificar
app.put('/:id', mdAuth.verificaToken, (req, res, next)=>{

    var id = req.params.id

    //Esto funciona si previamente hemos instalado la libreria BodyParse
    var body = req.body;


    // tenemos que verificar primero que el ID y/o usuario existe, que le pasaremos a findById, un Id y nos devuelve un callBAck con el error, y una response(respuesta), en este caso seria un usuario con ese ID si todo sale bien , por eso le ponemos a la variable USUARIO.
    Usuario.findById(id, (err, usuario)=>{

        
        if (err) {
            //error BBDD el error es 500 mirar el PDF de errores
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR al buscar usuario',
                errors: err
            });
        }

        if(!usuario){
             //error BBDD el error es 500 mirar el PDF de errores
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el' + id + ' no existe',
                errors: {message: 'no existe un usuario con ese ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado)=>{
            if (err) {
                //error BBDD el error es 400 mirar el PDF de errores
                return res.status(500).json({
                    ok: false,
                    mensaje: 'ERROR al actualizar el usuario',
                    errors: err
                });
            }

            //otra forma de ::: NO DEVOLVER EL PASSWORD :::

            usuarioGuardado.password = ':)'
            // success
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                respuesta: {message: 'A sido guardado correctamente tu usuario'}
            });
        });
    });
});

// ==========================
// Crear un usuario
// ==========================

app.post('/', mdAuth.verificaToken, (req, res)=>{

    //Esto funciona si previamente hemos instalado la libreria BodyParse
    var body = req.body;

    //este var usuario Hace referencia al modelo de usuario de usuario.model, y los inicializamos/referenciamos
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    // para guardar esos datos
    usuario.save((err, usuarioGuardado)=>{
        if (err) {
            //error BBDD el error es 400 mirar el PDF de errores
            return res.status(400).json({
                ok: false,
                mensaje: 'ERROR al crear usuario',
                errors: err
            });
        }
        // success
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });
})


// ==========================
// Borrar un usuario por ID
// ==========================

app.delete('/:id', mdAuth.verificaToken, (req, res, next)=>{

    var id = req.params.id;

    //cona la funciion de mongoose findByIdAndRemove busca el id y lo borra
    Usuario.findByIdAndRemove(id, (err, usuarioBorrardo)=>{
        if (err) {
            //error BBDD el error es 400 mirar el PDF de errores
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrardo) {
            //error BBDD el error es 400 mirar el PDF de errores
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: {message: 'No existe ningun usuario con ese ID: ' + err}
            });
        }
        // success
        res.status(201).json({
            ok: true,
            usuario: usuarioBorrardo
        });
    })


})



module.exports = app;