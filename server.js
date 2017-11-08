var express = require('express');
var cors = require('cors')
var session = require('express-session');
var passport = require('passport');
var FirebaseStore = require('connect-firebase')(session);
var app = express();

app.use(session({
  secret: 'YOURSESSIONSECRETKEY', // Change this to anything else
  resave: false,
  saveUninitialized: true
}));
app.use(cors())

var OpenIDStrategy = require('passport-openid').Strategy;
var SteamStrategy = new OpenIDStrategy({
    // OpenID provider configuration
    providerURL: 'http://steamcommunity.com/openid',
    stateless: true,
    // How the OpenID provider should return the client to us
    returnURL: 'http://localhost:4000/auth/openid/return',
    realm: 'http://localhost:4000/',
  },
  // This is the "validate" callback, which returns whatever object you think
  // should represent your user when OpenID authentication succeeds.  You
  // might need to create a user record in your database at this point if
  // the user doesn't already exist.
  function(identifier, done) {
    // The done() function is provided by passport.  It's how we return
    // execution control back to passport.
    // Your database probably has its own asynchronous callback, so we're
    // faking that with nextTick() for demonstration.
    process.nextTick(function() {
      // Retrieve user from Firebase and return it via done().
      var user = {
        identifier: identifier,
        // Extract the Steam ID from the Claimed ID ("identifier")
        steamId: identifier.match(/\d+$/)[0]
      };
      // In case of an error, we invoke done(err).
      // If we cannot find or don't like the login attempt, we invoke
      // done(null, false).
      // If everything went fine, we invoke done(null, user).
      return done(null, user);
    });
  });
passport.use(SteamStrategy);

passport.serializeUser(function(user, done) {
    done(null, user.identifier);
});

passport.deserializeUser(function(identifier, done) {
    // For this demo, we'll just return an object literal since our user
    // objects are this trivial.  In the real world, you'd probably fetch
    // your user object from your database here.
    done(null, {
        identifier: identifier,
        steamId: identifier.match(/\d+$/)[0]
    });
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(request, response) {
    response.write('<!DOCTYPE html>')
    if (request.user) {
        response.write(request.session.passport &&
            JSON.stringify(request.user) || 'None');
        response.write('<form action="/auth/logout" method="post">');
        response.write('<input type="submit" value="Log Out"/></form>');
    } else {
        if (request.query.steamid) {
            response.write('Not logged in.');
        }
        response.write('<form action="/auth/openid" method="post">');
        response.write(
            '<input name="submit" type="image" src="http://steamcommunity-a.' +
            'akamaihd.net/public/images/signinthroughsteam/sits_small.png" ' +
            'alt="Sign in through Steam"/></form>');
    }
    response.send();
});

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// ```
//
//
// Add parameters to the path
// --------------------------
// Express also lets us define variables in the path.  These variables
// will be stored by Express in the `httpRequest.params` object.
// We can then use those variables to construct a response.
// Open a web browser to [http://localhost:4000/steam/hello/Rachel]
// (http://localhost:4000/steam/hello/Rachel).
//
// Try changing "Rachel" in the URL in the browser.
//
// ```js

app.get('/hello/:name', function(httpRequest, httpResponse) {
  var name = httpRequest.params.name;
  httpResponse.send('Hello, ' + name + '!');
});

// ```
//
// Changing tracks from Express for a moment to introduce the 'request' package.
//
// We can use the `request` package to make our own HTTP requests.  For example,
// make an HTTP request to the Steam API to download the Civ5 achievements.

var request = require('request');

app.get('/steam/:appid', function(httpRequest, httpResponse) {
  // Calculate the Steam API URL we want to use
  var url = 'http://store.steampowered.com/api/appdetails?appids=' + httpRequest.params.appid;
  request.get(url, function(error, steamHttpResponse, steamHttpBody) {
    console.log(steamHttpBody)
    // Once we get the body of the steamHttpResponse, send it to our client
    // as our own httpResponse
    httpResponse.setHeader('Content-Type', 'application/json');
    httpResponse.json(steamHttpBody);
  });
});

app.post('/auth/openid', passport.authenticate('openid'), function(request, response) {

});

app.get('/auth/openid/return', passport.authenticate('openid'),
    function(request, response) {
        if (request.user) {
          console.log(response);
        } else {
        }
});

app.post('/auth/logout', function(request, response) {
    request.logout();
    // After logging out, redirect the user somewhere useful.
    // Where they came from or the site root are good choices.
    response.redirect(request.get('Referer') || '/')
});
// ```
//
// Combine the previous two techniques (variables in paths, request package).
//
// Open a web browser to [http://localhost:4000/steam/game/8930/achievements]
// (http://localhost:4000/steam/game/8930/achievements) then try changing `8930`
// (Civ5) to `292030` (Witcher 3).
//
// ```js

app.get('/steam/game/:appid/achievements', function(httpRequest, httpResponse) {
  // Calculate the Steam API URL we want to use
  var url = 'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/' +
    'v2/?key=52F69C7CE75FC1CAEAE21B70377C90B3&appid=' +
    httpRequest.params.appid;
  request.get(url, function(error, steamHttpResponse, steamHttpBody) {
    httpResponse.setHeader('Content-Type', 'application/json');
    httpResponse.send(steamHttpBody);
  });
});

// ```
//
//
// Host static files
// -----------------
// What about your static files like `index.html` and `my-angular-app.js`?
// You might expect from the preceding that we'd need to bind event handlers
// for every path.  Well, maybe we can get clever and use those parameters
// in the path.  We'd need to learn how to read files from the filesystem
// and… ugh.  Yep, We can totally do that.
//
// No, we're not going to do that.
//
// This is such a common problem that Express has included
// a piece of software to handle it.  This software is called
// `express.static`.  If you call `express.static('public')`, Express
// writes an event handler for you to serve up static files, if they exist,
// in the 'public' folder.  All you need to do is to tell Express when to
// use it.  To tell express when to to call the new handler, use `app.use`.
//
// After you call `app.use`, files like 'public/index.html' can be accessed
// in a web browser at [http://localhost:4000/static/index.html]
// (http://localhost:4000/static/index.html).
//
// ```js

app.use('/', express.static('public'));

// ```
//
//
// ### Why `/static`?
//
// You could totally just use `/`.  It's your choice.
// However, it's a good practice to place static files under a different path.
// If you accidentally name a file in a way that matches a path that's handled
// by one of your HTTP event handlers, the file wins.
// But, you don't really want to have to remember that.
// Careful file naming can prevent these problems.
//
//
// ### Why `app.use`; why not `app.get`?
//
// The handlers that can be passed to `app.use` are a bit fancier that what
// we've been writing.  They need to know more about Express' innards and they
// get executed before the HTTP event handlers that we've been writing.
// In fact, they can do some neat pre-processing on
// the incoming HTTP requests before our event handlers see them.  After
// using `app.use` with `express.static`, Express makes a new decision when
// an incoming HTTP request comes in:
//
// > IF there is a file at the requested path, respond with it;
// > IF NOT, try to use one of our event handlers.
//
// It would take a lot of extra work to put this decision into every `.get()`
// event handler.  So, `app.use` saves us a ton of work.
//
//
// What was httpRequest for?
// -------------------------
// What about that httpRequest parameter?  We haven't done much with it yet.
// Typically HTTP GET requests don't have a body, but that's not the case
// with POST and PUT.  When a web browser sends new data to the server,
// they place that new data in the body of the HTTP POST or HTTP PUT request.
//
// ```js

var bodyParser = require('body-parser');

app.use(bodyParser.text());

// ```
//
// You'll need to use Postman to test out this example, because web browsers
// don't give users an easy way to make an HTTP POST.
//
// Just to show how this works, we'll just write the HTTP POST body to the
// console.  So, open up Postman and make an HTTP POST to
// [http://localhost:4000/frank-blog](http://localhost:4000/frank-blog).
//
// To constuct your request in Postman, click the 'GET' dropdown next
// to the URL and change to POST, then click the 'BODY' tab and choose
// the 'raw' radio button.  Change the content type to 'Text'.  Type some text
// in the body, then send the request.
//
// ```js

app.post('/frank-blog', function(httpRequest, httpResponse) {
  console.log(httpRequest.body);
  // We need to respond to the request so the web browser knows
  // something happened.
  // If you've got nothing better to say, it's considered good practice to
  // return the original POST body.
  httpResponse.status(200).send('Posted today:\n\n' + httpRequest.body);
});

// ```
//
//
// Start the server
// ----------------
// Finally, we just add a few lines at the end of the file to start up the Express
// server.
//
// ```js

var port = 4000;
var server = app.listen(port);
console.log('Listening on port ' + port);

// ```
//
// That's it.  Just run this file ([`server.js`]
// (https://gist.github.com/johnchristopherjones/c6c8928d2ffa5ccbda6a))
// with the command `node server.js`.
//
// To stop the server, return to the terminal and type `⌃C` (control-c)
// in the terminal.
//
// To make changes to the server, edit server.js.  Stop the server with ⌃C
// and start it up again with `node server.js`.
