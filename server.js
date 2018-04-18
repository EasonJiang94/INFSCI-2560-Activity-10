var express = require('express');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

// OAuth 1.0-based strategies require a `verify` function which receives the
// credentials for accessing the API on the
// user's behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
// the process.env values are set in .env
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'https://'+process.env.PROJECT_DOMAIN+'.glitch.me/login/github/return',
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

// Create a new Express application.
var app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// index route
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// on clicking "logoff" the cookie is cleared
app.get('/logoff',
  function(req, res) {
    req.session.destroy();
    res.redirect('/');
  }
);

app.get('/auth/github', passport.authenticate('github'));

app.get('/login/github/return', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/success');
  }
);

app.get('/success',
  require('connect-ensure-login').ensureLoggedIn('/'),
  function(req, res){
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.sendFile(__dirname + '/views/success.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
