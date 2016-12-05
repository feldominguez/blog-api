var dotenv = require('dotenv');
dotenv.config();

var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var cors = require('cors');
var bodyParser = require('body-parser');

var DB_NAME = process.env.DB_NAME;
var DB_USER = process.env.DB_USER;
var DB_PASSWORD = process.env.DB_PASSWORD;
var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD,{
    dialect: 'mysql',
    host: process.env.DB_HOST
});

var BlogPost = sequelize.define('blogPost', {
    title:{
        type: Sequelize.STRING   
    },
    text:{
        type: Sequelize.STRING
    },
    imgUrl:{
        type: Sequelize.STRING
    }
},
{
    timestamps: true
}
                               );


app.use(cors());
app.use(bodyParser());


app.get('/', function(req, res){
    var promise = BlogPost.findAll();
    promise.then(function(blogPosts){
        res.json({
            data: blogPosts
        });
    });
});

app.post('/', function(req,res){
   var blogPost = BlogPost.build({
       title: req.body.title,
       text: req.body.text,
       imgUrl: req.body.imgUrl
   });
    blogPost.save().then(function(blogPost){
        res.json(blogPost);
    });
});




app.get('/blog/:id',function(req,res){
    var promise = BlogPost.findAll({where:{id:req.params.id}});
    promise.then(function(blogPosts){
       res.json({
            data: blogPosts
       })
    });
});


app.put('/blog/:id', function(req, res) {
  BlogPost.findById(req.params.id).then(function(blogPost) {
    if (blogPost) {
      blogPost.update({
        title: req.body.title,
       text: req.body.text,
       imgUrl: req.body.imgUrl
      }).then(function(blogPost) {
        res.json(blogPost);
      });
    } else {
      res.status(404).json({
        message: 'Post not found'
      });
    }
  });
});


app.delete('/blog/:id', function(req, res) {
  BlogPost.findById(req.params.id).then(function(blogPost) {
    if (blogPost) {
      blogPost.destroy().then(function(blogPost) {
        res.json(blogPost);
      });
    } else {
      res.status(404).json({
        message: 'Post not found'
      });
    }
  });
});


app.listen(process.env.PORT || 300)
