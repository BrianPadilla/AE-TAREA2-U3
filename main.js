const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //trae los parámetros del request para mejor
//manipulacion

//conexión a mongo como la pide a partir de la v5
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/bdusuarios',{useNewUrlParser:true});



//Construyendo el esquema
const usuarioSchema =  new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    }
});

//modelo 3 parámetros el primero como se llama en node
//el segundo el esquema, y el tercero como se llamará la colección en mongo

const Usuario = mongoose.model('Usuario',usuarioSchema,'usuarios');

//definir endpoints

const usuarioRouter = express.Router();

usuarioRouter.post("/",(req,res)=>{
    //const product recibe un json, debe tener la estructura del esquema definido
    const usuario = req.body;
    Usuario.create(usuario)
    .then(data=>{
        console.log(data);
        res.status(200);
        res.json({
            code:200,
            msj:"Saved!!!",
            detail:data
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400);
        res.json({
            code:400,
            msj:"No se pudo insertar!!!",
            detail:error
        });
    });
});



usuarioRouter.get("/",(req,res)=>{

    Usuario.find({})
    .then(usuarios=>{
        res.status(200);
        res.json({
            code:200,
            msg: "Consulta exitosa",
            detail: usuarios
        });
    })
    .catch(error=>{
        res.status(400),
        res.json({
            code:400,
            msg: "Error!!",
            detail: error
        })
    });

});


UsuarioRouter.get("/:id",(req,res)=>{

    const id = req.params.id; //debe llamarse igual el de la ruta y el de params

    Usuario.find({_id:id})
    .then(usuarios=>{
        res.status(200);
        res.json({
            code:200,
            msg: "Consulta exitosa",
            detail: usuarios
        });
    })
    .catch(error=>{
        res.status(400),
        res.json({
            code:400,
            msg: "Error!!",
            detail: error
    });

});

});


UsuarioRouter.delete("/:id",(req,res)=>{

    const {id} = req.params; //pusca en params lo descompone y asigna a {id} el equivalente
    Usuario.remove({_id:id})
    .then(data=>{
        res.status(200);
        res.json({
            code:200,
            msg:"Se eliminó!!!",
            detail: data
        })
    })
    .catch(error=>{
        res.status(400);
        res.json({
            code:400,
            msg:"No se eliminó",
            detail: error
        })
    
    });

}); //fin delete

UsuarioRouter.put("/:name",(req,res)=>{
 
    const name = req.params.name;
    const dato =  req.body.name;

    Usuario.findOneAndUpdate({name:name},{$set:{name:dato}},{new:true})
    .then(usuarios=>{
        res.status(200);
        res.json({
            code:200,
            msg:"Actualizado",
            detail:usuarios
        })
    })
    .catch(error=>{
        res.status(400);
        res.json({
            code:400,
            msg:"Error al actualizar",
            detail:error
        })
    })


});


//configurando servidor express
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use("/usuarios",UsuarioRouter);

//Ejecutando el servidor HTTP este modulo viene en el core de node.js
const server = require('http').Server(app);
const port = 3002;

//Ejecutando el servidor
server.listen(port);
console.log(`Running on port ${port}`);
