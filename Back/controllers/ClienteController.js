'use strict'

var Cliente = require('../models/cliente');
var Venta = require('../models/venta');
var Dventa = require('../models/dventa');
var Review = require('../models/review');
var Contacto = require('../models/contacto');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Direccion = require('../models/direccion');

const registro_cliente = async function(req,res){
    //variable para que reciba toda la data que esta en el cuerpo del request
    var data = req.body;
    var clientes_arr = [];
    clientes_arr = await Cliente.find({email:data.email});
    if (clientes_arr.length == 0) {
        //crea        
        if (data.password) {
            //crea
            bcrypt.hash(data.password, null, null, async function(err, hash) {
                if (hash) {
                    data.password = hash;
                    //registrando
                    var reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message:'ErrorServer',data:undefined});
                }
            })
        }else{
            res.status(200).send({message:'No hay una constraseña',data:undefined});
        }
    }else{
        res.status(200).send({message:'El correo ya existe en la base de datos',data:undefined});
    }
}

const login_cliente = async function(req,res){
    var data = req.body;
    //creando arreglo de cliente
    var cliente_arr = [];
    //buscando email con la bd
    cliente_arr = await Cliente.find({email:data.email});
    if (cliente_arr == 0) {
        // no hay correo en bd
        res.status(200).send({message: 'No se encontro el correo', data:undefined});
    }else{
        //si hay email que coincide = login
        let user = cliente_arr[0];
        //desenceriptando password
        bcrypt.compare(data.password, user.password, async function(error, check) {
            if (check) {
                //login
                //si esta bien el pass manda data
                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                });
            }else{
                res.status(200).send({message: 'La contraseña no coincide', data:undefined});
            }
        });
    }
    
}

const listar_clientes_filtro_admin = async function(req,res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];

            console.log(tipo);

            if (tipo == null || tipo == 'null') {
                let reg = await Cliente.find();
                res.status(200).send({data:reg});
            }else{
                //FILTRO
                if (tipo == 'apellidos') {
                    let reg = await Cliente.find({apellidos: new RegExp(filtro, 'i')});
                    res.status(200).send({data:reg});
                }else if(tipo == 'correo'){
                    let reg = await Cliente.find({email: new RegExp(filtro, 'i')});
                    res.status(200).send({data:reg});
                }
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const registro_cliente_admin = async function (req, res) {
    if (req.user) {
    if (req.user.role === 'admin') {
        const data = req.body;
        try {
        //VALID.CORREO
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const existingCliente = await Cliente.findOne({ email: data.email });
        //VALID.NUM_LONG
        const numRegex = /^[0-9]+$/;
        function validarLongitud(texto, longitudRequerida) {
            const regex = new RegExp(`^.{${longitudRequerida}}$`);
            return regex.test(texto);
        }
        //VALID.FECHA
        const dateParts = data.f_nacimiento.split('-');
        const yearOfBirth = parseInt(dateParts[0]);
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

        //EMAIL
        if (!emailRegex.test(data.email)) {
            return res.status(200).send({ message: 'El correo no es válido', data: undefined });
        }
        if (existingCliente) {
            return res.status(200).send({ message: 'El correo ya existe en la base de datos', data: undefined });
        }
        //TFONO
        if (!numRegex.test(data.telefono)) {
            return res.status(200).send({ message: 'El teléfono solo puede contener números', data: undefined });
        }
        if (!numRegex.test(data.telefono) || !validarLongitud(data.telefono, 9)) {
            return res.status(200).send({ message: 'El teléfono debe contener 9 dígitos numéricos', data: undefined });
        }
        //FNACIMIENTO
        if (yearOfBirth > eighteenYearsAgo.getFullYear()) {
            return res.status(200).send({ message: 'Debes ser mayor de 18 años para registrarte', data: undefined });
        }
        //DNI
        if (!numRegex.test(data.dni)) {
            return res.status(200).send({ message: 'El DNI solo puede contener números', data: undefined });
        }
        if (!numRegex.test(data.dni) || !validarLongitud(data.dni, 8)) {
            return res.status(200).send({ message: 'El DNI debe contener 8 dígitos numéricos', data: undefined });
        }
        
        //Agrega un producto
        bcrypt.hash('123456789', null, null, async function (err, hash) {
            if (hash) {
                data.password = hash;
                const reg = await Cliente.create(data);
                return res.status(200).send({ data: reg });
            } else {
                return res.status(200).send({ message: 'Hubo un error en el servidor', data: null });
            }
        });
        
        } catch (error) {
        return res.status(500).send({ message: 'Hubo un error en el servidor', data: null });
        }
    } else {
        return res.status(500).send({ message: 'NoAccess' });
    }
    } else {
    return res.status(500).send({ message: 'NoAccess' });
    }
};
const obtener_cliente_admin=async function(req,res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];
            try {
                var reg = await Cliente.findById({_id:id});
                res.status(200).send({data:reg});
            } catch (error) {
                res.status(200).send({data:undefined});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const actualizar_cliente_admin = async function(req,res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];
            var data = req.body;
            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero
            });
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_cliente_admin = async function(req,res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];
            let reg = await Cliente.findByIdAndDelete({_id:id});
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_cliente_guest=async function(req,res){
    if (req.user) {
        var id = req.params['id'];
            try {
                var reg = await Cliente.findById({_id:id});
                res.status(200).send({data:reg});
            } catch (error) {
                res.status(200).send({data:undefined});
            }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const actualizar_perfil_cliente_guest=async function(req,res){
    if (req.user) {
        var id = req.params['id'];
        var data = req.body;
        console.log(data.password);
        if (data.password) {
            console.log('con contraseña');
            bcrypt.hash(data.password,null,null, async function(err,hash){
                var reg = await Cliente.findOneAndUpdate({_id:id},{
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    dni: data.dni,
                    genero: data.genero,
                    pais: data.pais,
                    password: hash
                });
                res.status(200).send({data:reg});
            });
        }else{
            console.log('con contraseña');
            var reg = await Cliente.findOneAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero,
                pais: data.pais
            });
            res.status(200).send({data:reg});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


/****************************************************************************/
//ÓRDENES

const obtener_ordenes_cliente = async function (req,res){
    if (req.user) {
        var id = req.params['id'];
        let reg = await Venta.find({cliente: id}).sort({createdAt: -1});
        if (reg.length >= 1) {
            res.status(200).send({data: reg});
        }else if (reg.length == 0) {
            res.status(200).send({data: undefined});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_detalles_ordenes_cliente = async function (req,res){
    if (req.user) {
        var id = req.params['id'];
        try {
            let venta = await Venta.findById({_id:id}).populate('direccion').populate('cliente');
            let detalles = await Dventa.find({venta:id}).populate('producto');
            res.status(200).send({data:venta, detalles:detalles});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


/****************************************************************************/
//DIRECCIONES

const registro_direccion_cliente = async function(req,res) {
    if (req.user) {
        var data = req.body;
        if (data.principal) {
            let direcciones = await Direccion.find({cliente: data.cliente});
            direcciones.forEach(async element =>{
                await Direccion.findByIdAndUpdate({_id: element._id}, {principal:false});
            })
        }
        let reg = await Direccion.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_direcciones_todos_cliente = async function (req,res){
    if (req.user) {
        var id = req.params['id'];
        let direcciones = await Direccion.find({cliente:id}).populate('cliente').sort({createdAt:-1});
        res.status(200).send({data:direcciones});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const cambiar_direccion_principal_cliente = async function (req,res){
    if (req.user) {
        var id = req.params['id'];
        var cliente = req.params['cliente'];
        let direcciones = await Direccion.find({cliente:cliente});
        direcciones.forEach(async element=>{
            await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
        });

        await Direccion.findByIdAndUpdate({_id:id},{principal:true});
        
        res.status(200).send({data:true});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_direccion_principal_cliente = async function (req,res){
    if (req.user) {
        var id = req.params['id'];
        var direccion = undefined;

        direccion = await Direccion.findOne({cliente:id,princiapl:true});
        if (direccion == undefined) {
            res.status(200).send({data:undefined});
        }else{
            res.status(200).send({data:direccion});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


/****************************************************************************/
//CONTACTO

const enviar_mensaje_contanto = async function (req,res){
    let data = req.body;
    data.estado = 'Abierto';
    let reg = await Contacto.create(data);
    res.status(200).send({data:reg});
}


/****************************************************************************/
//REVIEWS

const emitir_review_producto_cliente = async function (req,res){
    if (req.user) {
        let data = req.body;
        let reg = await Review.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_review_producto_cliente = async function (req,res){
    let id = req.params['id'];
    let reg = await Review.find({producto:id}).sort({createdAt: -1});
    res.status(200).send({data:reg});
}

const obtener_reviews_cliente = async function (req,res){
    if (req.user) {
        let id = req.params['id'];
        let reg = await Review.find({cliente: id}).populate('cliente');
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest,
    registro_direccion_cliente,
    obtener_direcciones_todos_cliente,
    cambiar_direccion_principal_cliente,
    obtener_direccion_principal_cliente,
    enviar_mensaje_contanto,
    obtener_ordenes_cliente,
    obtener_detalles_ordenes_cliente,
    emitir_review_producto_cliente,
    obtener_review_producto_cliente,
    obtener_reviews_cliente
}