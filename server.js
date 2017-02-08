// server.js
// where your node app starts

// set up twitter passport for oauth
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;

passport.use(new Strategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
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

// init project
var express = require('express');
var app = express();
var expressSession = require('express-session');
var connect = require('connect-ensure-login');

app.use(express.static('public'));
app.use(expressSession({ secret:'watchingferries', resave: true, saveUninitialized: true }));


// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
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
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/success');
  }
);

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
