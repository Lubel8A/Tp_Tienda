var Cupon = require('../models/cupon');

const registro_cupon_admin = async function (req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let data = req.body;

            // Validate valor and limite
            if (data.valor >= 0 && data.limite >= 0) {
                // If both validations pass, create the coupon
                let reg = await Cupon.create(data);
                res.status(200).send({ data: reg });
            } else {
                // Send a 400 Bad Request response for validation errors
                if (data.valor < 0) {
                    res.status(400).send({ message: 'El valor debe ser positivo' });
                } else {
                    res.status(400).send({ message: 'El límite debe ser positivo' });
                }
            }
        } else {
            res.status(403).send({ message: 'NoAccess' }); // 403 indicates Forbidden
        }
    } else {
        res.status(403).send({ message: 'NoAccess' }); // 403 indicates Forbidden
    }
};

const listar_cupones_admin=async function(req,res){
    if (req.user) {
        if (req.user.role=='admin') {
            var filtro = req.params['filtro'];
            let reg = await Cupon.find({codigo: new RegExp(filtro, 'i')}).sort({createdAt: -1});
            res.status(200).send({data:reg});

        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_cupon_admin=async function(req,res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];

            try {
                var reg = await Cupon.findById({_id:id});
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

const actualizar_cupon_admin=async function(req,res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var data = req.body;
            var id = req.params['id'];

            let reg = await Cupon.findByIdAndUpdate({_id:id},{
                codigo: data.codigo,
                tipo: data.tipo,
                valor: data.valor,
                limite: data.limite
            });
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_cupon_admin = async function(req,res){
    if (req.user) {
        if (req.user.role == 'admin') {
            var id = req.params['id'];
            let reg = await Cupon.findByIdAndDelete({_id:id});
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const validar_cupon_admin = async function(req,res) {
    if (req.user) {
        var cupon = req.params['cupon'];
        var data = await Cupon.findOne({codigo: cupon});
        if (data) {
            if (data.limite==0) {
                res.status(200).send({data:undefined});
            }else{
                res.status(200).send({data:data});
            }
        }else{
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
    registro_cupon_admin,
    listar_cupones_admin,
    obtener_cupon_admin,
    actualizar_cupon_admin,
    eliminar_cupon_admin,
    validar_cupon_admin
}