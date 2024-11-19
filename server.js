var express = require('express');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var connectEnsureLogin = require('connect-ensure-login');

// Set up the GitHub OAuth strategy using environment variables

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'https://' + process.env.PROJECT_DOMAIN + '.glitch.me/login/github/return',
},


function(token, tokenSecret, profile, cb) {
  // Here you could store the profile in a database if you need to
  return cb(null, profile);  // Use the GitHub profile as the user object
}));

// Serialize user to session
passport.serializeUser(function(user, done) {
  done(null, user.id);  // Store the user's GitHub ID or other unique identifier
});

// Deserialize user from session
passport.deserializeUser(function(id, done) {
  // You would normally fetch the user from your database here using the ID
  done(null, { id: id });  // For this example, we just store the ID
});

// Create a new Express application
var app = express();

// Use application-level middleware for common functionality, including session handling
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,  // Set to false to avoid re-saving unchanged sessions
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }  // Ensure cookies are secure in production
}));

// Initialize Passport and restore authentication state from the session
app.use(passport.initialize());
app.use(passport.session());

// Index route
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Logoff route
app.get('/logoff', function(req, res) {
  req.session.destroy();  // Clear the session
  res.redirect('/');  // Redirect to home page after logging off
});

// GitHub OAuth route
app.get('/auth/github', passport.authenticate('github'));

// GitHub OAuth callback route
app.get('/login/github/return', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/success');  // Redirect to success page after successful login
  }
);

// Success route (only accessible if logged in)
app.get('/success', 
  connectEnsureLogin.ensureLoggedIn('/'),  // Ensure the user is logged in
  function(req, res) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.sendFile(__dirname + '/views/success.html');
});

// Start the server and listen for requests
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
