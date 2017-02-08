// server.js
// where your node app starts

// init project
var express = require('express');
var expressSession = require('express-session');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(expressSession({ secret:'watchingferries', resave: true, saveUninitialized: true }));

// set up twitter passport for oauth
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var connect = require('connect-ensure-login');

passport.use(new Strategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CONSUMER_CALLBACK
},
function(token, tokenSecret, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
  res.redirect('/login');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/success',
  connect.ensureLoggedIn(),
  function(req, res) {
    res.sendFile(__dirname + '/views/success.html');
  }
);

app.get('/login/twitter', passport.authenticate('twitter'));

app.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/success');
  }
);

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
