const express = require('express');
//para encriptar la contraseña, 
const bcrypt = require('bcryptjs');
//Para crear los token unicons 
const jwt = require('jsonwebtoken');

//debemos importar lo primero nuestro modelo de usuario
var Usuario = require('../models/usuario.model');

const app = express();

const SEED = require('../config/config').SEED
const GOOGLE_SECRET = require('../config/config').GOOLE_SECRET
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID
const { OAuth2Client } = require('google-auth-library');


// ==========================
// Autintificacion con google
// ==========================
//Nueva forma peticion con google y toke, que hemos generado en la aplicacion de prueba google sign demo,
// lo que haremos es que cuando el usuario desde el front-end se valdie con google, qgeneraremos un token, y ese token lo validaremos aqui
app.post('/google', (req, res, next) => {
    var token = req.body.token;
    const oAuth2Client = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_SECRET
    );
    const tiket = oAuth2Client.verifyIdToken({
        idToken: token
        //audience: GOOGLE_CLIENT_ID
    });
    tiket.then(data => {

        //Aqui comprobamos que busqeu si hay uno ya autentificado con GOOGLE
        Usuario.findOne({email: data.payload.email}, (err, usuario)=>{
            //ERROR por que no exite el usuario en BBDD
            if(err){
                return  res.status(500).json({
                    ok: false,
                    mensjae: 'Error al buscar un usuario',
                    error: err
                })
            }
            //Si esiste ese usuario sigueintes pasos
            if(usuario){
                //Si existe el usuario, con ese email pero su condicio de google es false, le decimos que se autentifique con su correo electronico
                if (usuario.google === false) {
                    return  res.status(400).json({
                        ok: false,
                        mensjae: 'DEBE de usuar su autentificacion normal',
                        error: err
                    })
                // si existe el usuario, y si su condicion de google es Verdadera, generanmos un nuevo token
                } else{
                    //borrar el usuario para no devolverlo en la respuesta
                    usuario.password = ":)"
                    
                    //Clave secreta unica de nuestra aplicacion
                    //Crear un token!!! parametros, datos del usuario 2º algún string único, y la fecha de expiracion en estes caso 4 horas.
                    var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 })
                    res.status(200).json({
                        ok: true,
                        usuario: usuario,
                        token: token,
                        id: usuario._id
                    });
                }
            } else {
                //si el usuario no fue creado mediante su correo electronico, entonces lo creamos con los datos de google
                var usuario = new Usuario();

                usuario.nombre = data.payload.name;
                usuario.email = data.payload.email;
                usuario.password = ':)'
                usuario.img = data.payload.picture;
                usuario.google = true;

                usuario.save((err, usuarioDB) => {

                    if (err) {
                        return res.status(500).json({
                            ok: true,
                            mensaje: 'Error al crear usuario - google',
                            errors: err
                        });
                    }

                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                    res.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token: token,
                        id: usuarioDB._id,
                        //menu: obtenerMenu(usuarioDB.role)
                    });

                });
            }
        })
    });
});


// ==========================
// Authentificacion normal
// ==========================
app.post('/', (req, res) => {
    //traemos los datos por el body desde el front
    var body = req.body
    //utilizamos findOne por que buscamos un unico usuario con ese unico email
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            //validamos si hay un error en la respuesta desde BBDD
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR al buscar usuarios',
                errors: err
            });
        }
        if (!usuarioBD) {
            //validamos si el usuario existe
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //borrar el usuario para no devolverlo en la respuesta
        usuarioBD.password = ":)"

        //Clave secreta unica de nuestra aplicacion
        //Crear un token!!! parametros, datos del usuario 2º algún string único, y la fecha de expiracion en estes caso 4 horas.
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        });
    })



})

module.exports = app;