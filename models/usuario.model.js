//para hacer el modelo para la base de datos, es en singular por que es un solo registro como modelo de una collecion de la base de datos

var mongoose = require('mongoose');
//explicado abajo
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

//poder controlar los valores que yo queiro permitir, en este caso seran los ROLES, se aplica luego sobre el daton con el emun

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'], 
    message: '{VALUE} :: no es un role valido'
}

//creamos una nueva instancia del objeto Schema

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido']},
    email: { type: String, unique:true, required: [true, 'EL correo es requerido']},
    password: { type: String, required: [true, 'LA contraseña es requerido']},
    img: { type: String, required:false},
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos}
});

usuarioSchema.plugin(uniqueValidator, { message:'{PATH} :: debe ser unico'})

//Para poder usarlo en otros sitios, hay que exportar el Schema

module.exports = mongoose.model('Usuario', usuarioSchema);



//UNIQUE VALIDATOR de MONGOOSE es una libreria que nos automatiza la valizacion por ejemplo en el email de usuario unico