var express = require('express');
var fs = require('fs');
var mysql = require('./dbcon.js');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var artworkData = require('./fakedb.json'); // Temporary fake database for testing
var path = require('path');


app.use('/static', express.static('public/js'));
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitializd: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.engine('handlebars', handlebars({extname: 'handlebars', 
                                    defaultLayout: 'main', 
                                    layoutsDir: path.join(__dirname, 'views/layouts'), 
                                    partialsDir: [path.join(__dirname, 'views/partials')]}));
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.set('port', 7791);

app.get('/', function(req,res) {
  if(req.session.loggedin) {
    res.render('home');
  }
  res.render('login');
})

app.get('/home',function(req,res,){
  if (req.session.loggedin) {
    var context = {}; 
    context.artworkData = artworkData;
    context.userInfo = req.session.userInfo;
    res.render('home', context);
  } else {
    // could create handlebars page for failed authentication 
    // instead of code below and render it
    res.write('<h1>Please login First.</h1>');
    res.end('<a href=' + '/' + '>Login</a>');
  }
});

app.post('/authu', function(req,res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    mysql.pool.query('SELECT * FROM Users WHERE username=? AND password=?', [username, password], function(error, results, fields) {
      if (error) {
        res.send('Incorrect username and/or password');
      } else {
        req.session.loggedin = true;
        req.session.userInfo = results[0];
        res.redirect('/home');
      }
      res.end();
    });
  } else {
    res.send('Please enter username and password')
    res.end();
  }
});

app.get('/upload', function(req,res,next) {
  var callbackCount = 0;
  var context = {};
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

function setVals(results) {
  userResults = results;
  console.log(userResults);
  return userResults;
}