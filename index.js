var express = require('express');
/* Don't need db at the moment, only static files
var mysql = require('./dbcon.js');
*/
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

//Set default directory
app.use(express.static('../public'));

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
