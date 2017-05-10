var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Produto = require('./models/produto');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/produtos');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

//Cria Rota
var router = express.Router();
router.use(function(req, res, next){
    next();
});

//Todas as rotas de produto
router.route('/produtos')
    .post(function(req, res){
        var produto = new Produto();
        produto.nome = req.body.name;
        produto.save(function(err){
            if(err)
            res.send(err);
            res.json({message:"Produto criado!"});
        });
})
    .get(function(req,res){
        Produto.find(function(err, produtos){
            if(err)
            res.send(err);

            res.json(produtos);
        });
    });
    

    router.route('/produtos/:produto_id')
    .get(function(req,res){
        Produto.findById(req.params.produto_id, function(err, produto){
            if(err)
            res.send(err);
            res.json(produto);
        });
    })
    .put(function(req, res){
        Produto.findById(req.params.produto_id, function(err, produto){
            if(err)
            res.send(err);

            produto.nome = req.body.name;
            produto.save(function(err){
                if(err)
                res.send(err);
                res.json({message: "Produto atualizado"});
            });
        });
    })
    .delete(function(req, res){
        Produto.remove({
            _id: req.params.produto_id
        }, function(err, produto) {
            if (err)
                res.send(err);

            res.json({ message: 'Produto excluído com sucesso!' });
        });
    })


//Registra as rotas
app.use('/api', router);

//Inicia
app.listen(port);