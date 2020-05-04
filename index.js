var express = require('express');
var fs = require('fs');
/* Don't need db at the moment
var mysql = require('./dbcon.js');
*/
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var artworkData = require('./fakedb.json'); // Temporary fake database for testing
var path = require('path');
//Sets default directory
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.engine('handlebars', handlebars({extname: 'handlebars', 
                                    defaultLayout: 'main', 
                                    layoutsDir: path.join(__dirname, 'views/layouts'), 
                                    partialsDir: [path.join(__dirname, 'views/partials')]}));
app.set('view engine', 'handlebars');
app.set('port', 7791);

app.get('/',function(req,res,next){
  var context = {};
  context.type = "artist/user";
  context.artworkData = artworkData;
  res.render('home', context);
});

app.get('/upload', function(req,res,next) {
  var context = {};
  context.type = "artist/user";
  res.render('upload-artwork', context);
});

app.post('/upload', function(req,res,next) {
  //pushes entered parameters to fakedb
  artworkData.push(
    {
      title: req.body.title,
      medium: req.body.medium,
      materials: req.body.material,
      description: req.body.description,
      rating: 0,
      url: req.body.url
    }
  );
  fs.writeFile(__dirname + '/fakedb.json', JSON.stringify(artworkData, 2, 2),
    function(err) {
      if(!err) {
        res.status(200).send();
      }
      else {
        res.status(500).send("Couldn't write to fakedb");
      }
    }
  );
});

app.get('/upload2', function(req,res,next) {
  res.render('upload');
})

app.get('/signup',function(req,res,next){
  var context = {};
  context.type = "user";
  res.render('home');
});

app.get('/login',function(req,res,next){
  var context = {};
  context.type = "artist/user";
  res.render('home');
});

app.get('/search',function(req,res,next){
  var context = {};
  context.type = "artist/user";
  res.render('search');
});

app.get('/events', function(req,res){
  var context = {};
  context.type = "artist";
  res.render('events', context);
});

app.get('/image-artist', function(req,res){
  var context = {};
  context.type = "artist";
  res.render('image-artist', context);
});

app.get('/image-user', function(req,res){
  var context = {};
  context.type = "user";
  res.render('image-user', context);
});

app.get('/artist-portfolio', function(req,res){
  var context = {};
  context.type = "artist/user";
  res.render('artist-portfolio', context);
});

app.get('/user-events', function(req,res){
  var context = {};
  context.type = "user";
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
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.')
});
