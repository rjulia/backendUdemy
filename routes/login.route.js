const express = require('express');
//para encriptar la contraseña, 
const bcrypt = require('bcryptjs');
//Para crear los token unicons 
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED


const app = express();

//debemos importar lo primero nuestro modelo de usuario
var Usuario = require('../models/usuario.model');

app.post('/', (req, res)=>{
    //traemos los datos por el body desde el front
    var body = req.body
    //utilizamos findOne por que buscamos un unico usuario con ese unico email
    Usuario.findOne({email:body.email}, (err, usuarioBD)=>{

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

        if ( !bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }
        //borrar el usuario para no devolverlo en la respuesta
        usuarioBD.password =":)"
        //Clave secreta unica de nuestra aplicacion
        
        //Crear un token!!! parametros, datos del usuario 2º algún string único, y la fecha de expiracion en estes caso 4 horas.
        var token = jwt.sign({usuario: usuarioBD}, SEED, {expiresIn: 14400})

        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token, 
            id: usuarioBD._id 
        });
    })



})

module.exports = app;