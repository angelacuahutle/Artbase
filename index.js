var express = require('express');
var fs = require('fs');
var mysql = require('./dbcon.js');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({extended: false});

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
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});
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

app.get('/home',function(req,res){
  if (req.session.loggedin) {
    var context = {}; 
    var callbackCount = 0;
    context.jsscripts = ["searchjq.js"];
    var mysql = req.app.get('mysql');
    getArtworks(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){
        res.render('home', context);
      }
    }
  } else {
    // Case for if not logged in
    res.redirect('/');
  }
});

app.get('/test', function(req, res) {
  // test page that outputs available session info
  var context = {};
  context.loggedin = req.session.loggedin;
  context.isUser = req.session.isUser;
  // sessInfo contains important info like the userID/artistID, username, etc.
  context.sessInfo = req.session.sessInfo;
  console.log("req.session:")
  console.log(req.session);
  res.render('test', context);
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
        console.log(JSON.stringify(error))
        res.write(JSON.stringify(error));
        res.end();
      } else if (!results[0]) {
        // password or username was wrong
        res.redirect('/artist-login');
      } else {
        req.session.loggedin = true;
        req.session.isUser = false;
        req.session.sessInfo = results[0];
        req.session.save();
        res.redirect('/home');
      }
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
        console.log(JSON.stringify(error))
        res.write(JSON.stringify(error));
        res.end();
      } else if (!results[0]) {
        // password or username was wrong
        res.redirect('/user-login');
      } else {
        req.session.loggedin = true;
        req.session.isUser = true;
        req.session.sessInfo = results[0];
        req.session.save();
        res.redirect('/home');
      }
    });
  } else {
    res.send('Please enter username and password');
    res.end();
  }
});

app.get('/user-login',function(req,res,next){
  res.render('user-login');
});

app.use('/user-signup', require('./public/js/user-signup.js'));

app.get('/artist-login',function(req,res,next){
  res.render('artist-login');
});

app.use('/artist-signup', require('./public/js/artist-signup.js'));

app.get('/search/:searchTag', urlencodedParser, function(req,res){
  var context = {}; 
  var callbackCount = 0; 
  context.jsscripts = ["searchjq.js"];
  var mysql = req.app.get('mysql');
  getArtworksLike(res, mysql, context, req.params.searchTag, complete);
  function complete() {
    callbackCount++;
    if (callbackCount >= 1) {
      res.render('home', context);
    }
  }
});

app.use('/events', require('./public/js/events.js'));

app.use('/artist-portfolio', require('./public/js/artist-portfolio.js'));

app.get('/image-router/:id', function(req, res) {
  if (req.session.isUser) {
    res.redirect('/image-user/' + req.params.id);
  } else if (!req.session.isUser) {
    res.redirect('/image-artist/' + req.params.id);
  } else {
    res.redirect('/');
  }
})

app.use('/image-artist', require('./public/js/image-artist.js'));

app.use('/image-user', require('./public/js/image-user.js'));

app.use('/user-events', require('./public/js/user-events.js'));

app.get('/access-denied', function(req, res) {
  res.render('access-denied');
})

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

function getArtworksLike(res, mysql, context, searchTag, complete) { 
  var sql = "SELECT * FROM Artworks "
    + "JOIN (SELECT Artists.artistID, Artists.username, CONCAT(Artists.firstName, ' ', Artists.lastName) AS artistName FROM Artists) AS fn ON fn.artistID=Artworks.artistID "
    + "WHERE fn.artistName LIKE " + "\'%" +searchTag + "%\'"
    + "OR title LIKE " + "\'%" + searchTag + "%\'"
    + "OR medium LIKE " + "\'%" + searchTag + "%\'"
    + "OR material LIKE " + "\'%" + searchTag + "%\'"
    + "OR description LIKE " + "\'%" + searchTag + "%\'"
    + "LIMIT 20;"
    console.log("SQL")
    console.log(sql)
    console.log("SEARCHTAG")
    console.log(searchTag)
    mysql.pool.query(sql, function(error, results, fields) {
      if(error){
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      }
      context.artworks = results;
      console.log(context.artworks);
      complete();
    })
}
