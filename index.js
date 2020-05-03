var express = require('express');
/* Don't need db at the moment
var mysql = require('./dbcon.js');
*/
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

//Sets default directory
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 7791);

app.get('/',function(req,res,next){
    res.render('home');
});

app.get('/signup',function(req,res,next){
    res.render('home');
});

app.get('/login',function(req,res,next){
    res.render('home');
});

app.get('/artist',function(req,res,next){
    res.render('home');
});

app.get('/search',function(req,res,next){
    res.render('home');
});

app.get('/events', function(req,res){
    var context = {};
    res.render('events', context);
});

app.get('/upload-artwork', function(req,res){
    var context = {};
    res.render('upload-artwork', context);
});

app.get('/image-artist', function(req,res){
    var context = {};
    res.render('image-artist', context);
});

app.get('/image-user', function(req,res){
    var context = {};
    res.render('image-user', context);
});

app.get('/artist-portfolio', function(req,res){
    var context = {};
    res.render('artist-portfolio', context);
});

app.get('/user-events', function(req,res){
    var context = {};
    res.render('user-events', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});