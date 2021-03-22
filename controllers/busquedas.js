const { response } = require("express");

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );
    
    const [ usuarios, hospitales, medicos ] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
        Medico.find({ nombre: regex })
    ]);

    /* const usuarios = await Usuario.find({ nombre: regex });
    const hospitales = await Hospital.find({ nombre: regex });
    const medicos = await Medico.find({ nombre: regex }); */


    try {
        res.json({
            ok: true,
            msg: 'getTodo',
            usuarios,
            hospitales,
            medicos
        })    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'TODO. Informa al administrador'
        });
    }
}

const getDocumentosCollecion = async(req, res = response) => {

    console.log('Ingresa');
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );
    
    let data = [];
    try {
        switch( tabla ) {
            case 'medicos':
                data = await Medico.find({ nombre: regex })
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img');
            break;
    
            case 'hospitales':
                data = await Hospital.find({ nombre: regex })
                                    .populate('hospital', 'nombre img');
            break;
    
            case 'usuarios':
                data = await Usuario.find({ nombre: regex });
            break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'La tabla tiene que se usuarios/medicos/hospitales'
                });
    
        }

        res.json({
            resultados: data,
            tabla,
            busqueda
        });
      
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'TODO Documento Colección. Informa al administrador'
        });
    }
}

module.exports = {
    getTodo,
    getDocumentosCollecion
}