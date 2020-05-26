var express = require('express');
var fs = require('fs');
var mysql = require('./dbcon.js');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var path = require('path');

app.use('/static', express.static('public/js'));
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  resave: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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
    var callbackCount = 0;
    var mysql = req.app.get('mysql');
    getArtworks(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){
        if (req.session.isUser) {
          context.sessInfo = req.session.userInfo;
          req.session.sessInfo = req.session.userInfo;
        } else {
          context.sessInfo = req.session.artistInfo;
          req.session.sessInfo = req.session.artistInfo;
        }
        console.log("ALL ARTWORKS")
        console.log(context.artworks);
        context.isUser = req.session.isUser;
        console.log("Session Account Info:");
        console.log(context.sessInfo);
        console.log("User status (True for User False for Artist):");
        console.log(req.session.sessInfo);
        res.render('home', context);
      }
    } 
  } else {
    // Case for if not logged in
    res.redirect('/');
  }
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

app.post('/autha', function(req,res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    mysql.pool.query('SELECT * FROM Artists WHERE username=? AND password=?', [username, password], function(error,results,fields) {
      if (error) {
        res.send('Incorrect username and/or password');
      } else {
        req.session.loggedin = true;
        req.session.isUser = false;
        req.session.artistInfo = results[0];
        res.redirect('/home');
      }
      res.end();
    });
  } else {
    res.send('Please enter username and password');
    res.end();
  }
});

app.post('/authu', function(req,res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    mysql.pool.query('SELECT * FROM Users WHERE username=? AND password=?', [username, password], function(error,results,fields) {
      if (error) {
        res.send('Incorrect username and/or password');
      } else {
        req.session.loggedin = true;
        req.session.isUser = true;
        req.session.userInfo = results[0];
        res.redirect('/home');
      }
      res.end();
    });
  } else {
    res.send('Please enter username and password');
    res.end();
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

app.use('/artist-portfolio', require('./artist-portfolio.js'));

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

function getArtworks(res, mysql, context, complete){
  mysql.pool.query("SELECT artworkID, title, url, Artworks.artistID, CONCAT(firstName, ' ', lastName) AS artistName FROM Artworks JOIN Artists ON Artists.artistID = Artworks.artistID", function(error, results, fields){
      if(error){
          res.write(JSON.stringify(error));
          res.end();
      }
      context.artworks = results;
      complete();
  });
}