var express = require('express');
var fs = require('fs');
var mysql = require('./dbcon.js');
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var artworkData = require('./fakedb.json'); // Temporary fake database for testing
var path = require('path');
//Sets default directory
app.use('/static', express.static('public'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.engine('handlebars', handlebars({extname: 'handlebars', 
                                    defaultLayout: 'main', 
                                    layoutsDir: path.join(__dirname, 'views/layouts'), 
                                    partialsDir: [path.join(__dirname, 'views/partials')]}));
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.set('port', 7791);

app.get('/',function(req,res,next){
  var context = {}; 
  context.type = "artist/user";
  context.artworkData = artworkData;
  res.render('home', context);
});

app.get('/upload', function(req,res,next) {
  var callbackCount = 0;
  var context = {};
  context.type = "artist/user";
  mysql.pool.query("SELECT name FROM Events ORDER BY name ASC", function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
    }   
    context.Events = results;
    complete();
  })
  function complete(){
    callbackCount++;
    if(callbackCount >= 1){
      res.render('upload-artwork', context);
    }
  }
});
/*
Inactive for step 3 draft
app.post('/upload', function(req,res,next) {
  //pushes entered parameters to fakedb
  artworkData.push(
    {
      title: req.body.title,
      medium: req.body.medium,
      materials: req.body.materials,
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
*/
app.get('/user-signup',function(req,res,next){
  var context = {};
  res.render('user-signup', context);
});

app.get('/user-login',function(req,res,next){
  var context = {};
  res.render('user-login', context);
});

app.get('/artist-signup',function(req,res,next){
  var context = {};
  res.render('artist-signup', context);
});

app.get('/artist-login',function(req,res,next){
  var context = {};
  res.render('artist-login', context);
});

app.get('/search',function(req,res,next){
  var context = {};
  context.type = "artist/user";
  res.render('search', context);
});

app.use('/events', require('./events.js'));

app.use('/image-artist', require('./image-artist.js'));

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
