var express = require('express');
var app = express();
var url = require('url');

app.get('/', function(httpRequest, httpResponse) {
    httpResponse.send('Hello, World!');
});

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

// Put it all together
// -------------------
//
// Now we can try something a little fancier.  We can use the `request` package
// to send our own HTTP requests to third parties.  We can use the third-party's
// response to help construct our own response.
//
// Open a web browser to [http://localhost:4000/steam/civ5achievements]
// (http://localhost:4000/steam/civ5achievements).
//

app.get('/steam/dota', function(httpRequest, httpResponse) {

    console.log(httpRequest);

    // Calculate the Steam API URL we want to use
    var url = 'http://store.steampowered.com/api/appdetails?appids=570';
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

app.get('/steam/:appid', function(httpRequest, httpResponse) {
    // Calculate the Steam API URL we want to use

    var url = 'http://store.steampowered.com/api/appdetails?appids=' + httpRequest.params.appid;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse

        console.log(steamHttpBody);

        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
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


app.get('/adduser/:username/:password', function(req, res) {

});

var port = 4000;
var server = app.listen(port);
console.log('Listening on port ' + port);
