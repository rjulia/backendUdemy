
const express = require('express');
const app = express();

const Hospital = require('../models/hospital.model');
const Medico = require('../models/medico.model');
const Usuario = require('../models/usuario.model');


// ==========================================
// Busqeuda porcollecion
// ==========================================

app.get('/coleccion/:tabla/:busqueda', (req, res)=>{

    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i');
    var tabla = req.params.tabla;

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })
    

});


// ==========================================
// Busqueda General
// ==========================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    //tenemso que pasar el termino por una expresion regular ya que la busqeuda por si sola es case sensitive, por eso generamos  REGEXP de javascript
    var regex = new RegExp( busqueda, 'i');

    //Para encandenar varias promesas a la vez, Promise.all

    Promise.all(
        [buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)]
    )
    .then(respuestas=>{
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        })
    })
    

});


function buscarHospitales(busqueda, regex) {
    return new Promise ((resolve, reject)=>{

        Hospital.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .exec((err, hospitales)=>{
                if(err){
                    reject('Error al cargar Hospitales')
                } else{
                    resolve(hospitales);
                }
        });
    });
}
function buscarMedicos(busqueda, regex) {
    return new Promise ((resolve, reject)=>{

        Medico.find({nombre: regex})
        .populate('usuario', 'nombre email')
        .populate('hospitales')
        .exec((err, medicos)=>{
            if(err){
                reject('Error al cargar medicos')
            } else{
                resolve(medicos);
            }
        });
    })
}

function buscarUsuarios(busqueda, regex) {
    return new Promise ((resolve, reject)=>{
        //La busqueda aqui es en varias columnas de la tabla Usuarios, por ejemplo el email y el nombre, para eso utilizamos la palabra or() que mandamos un arrreglo de busqeudas
        Usuario.find({}, 'nombre email role')
        .or( [ { 'nombre': regex } , { 'email' : regex } ] )
        .exec((err, usuarios)=>{
            if(err){
                reject('Erorr alñ mandar la informacion', err)
            } else {
                resolve(usuarios);
            }
        })
    })
}

module.exports = app