const express = require('express');

//inyectamos la libreria para usbir archivos 
const fileUpload = require('express-fileupload');
const app = express();

//para borrar y manejar files en node necesitamos importar la libreria de FS de node
var fs = require('fs');

//Modelos a importar
var Usuario = require('../models/usuario.model');
var Medico = require('../models/medico.model');
var Hospital = require('../models/hospital.model');

// default options, aqui mirar la documentacion para configurar mas parametros
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Colleciones permitidas validacionnes 
    var coleccionesPermitidas = ['hospitales', 'medicos', 'usuarios'];

    if (coleccionesPermitidas.indexOf(tipo) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Coleccion no valida',
            errors: {message: 'Solo se permiten archivos, ' + coleccionesPermitidas.join(', ')}
        });
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciona ningun archivos',
            errors: {message: ' Debe de selecionar un archivo'}
        });
    }

    //Obtener nombre del archvo
    var archivo = req.files.imagen;
    var getExtsionDelArchivo = archivo.name.split('.');
    var extensionArchivo = getExtsionDelArchivo[ getExtsionDelArchivo.length - 1 ]

    //Solo aceptamos ciertas extensiones, por que van a ser imagenes
    var extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];
    //Indexof para recorre todo el array y se devulva -1 es por que no hay ninguan coicidencia, ahi devolvemos un error
    if (extensionesPermitidas.indexOf(extensionArchivo) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no validad',
            errors: {message: 'Solo se permiten archvos, ' + extensionesPermitidas.join(', ')}
        });
    }
    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;


    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }



        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });


    })
   
});
// Esto es una funcion para comrpobar si existe y actualizarla, hacemos una para todos y comprobamos de donde viene, ADEMASSS tenemos que importar los modelos de Hopital, usuario y medico , ya que vamos a modificar y actualizar sus datos, para eso siempre necesitamos el modelo.

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe', usuario }
                });
            }


            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            })


        });

    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Médico no existe',
                    errors: { message: 'Médico no existe' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe, elimina la imagen anterior imporatado desde la libreria FS, mirar arriba
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de médico actualizada',
                    medico: medicoActualizado
                });

            })

        });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });

            })

        });
    }


}

module.exports = app