

//Para crear los token unicons 
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED


// ==========================
// Verificar token
// ==========================
exports.verificaToken = function (req, res, next) {

    var token = req.query.token;
    //en este caso lo enviaremos desde el frontend por el URL, podriamos mandarlos por los HEADERS de la peticion HTTP
    jwt.verify(token, SEED, (err, decoded)=>{
        if (err) {
            //error BBDD
            return res.status(401).json({
                ok: false,
                mensaje: 'ERROR no estas autorizado',
                errors: err
            });
        }
        // De esta forma dispongo de los datos del usuairo en cuanqueir parte qeu sue el autentificar usuario
        req.usuario = decoded.usuario;
        next();
    });
}

    

