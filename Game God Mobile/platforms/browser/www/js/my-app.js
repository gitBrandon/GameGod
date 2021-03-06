// Initialize app
var myApp = new Framework7({
  swipePanel: 'left'
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
  //this is only ios applicable:
  dynamicNavbar: false
});

// var leftNavBar = myApp.addView('.custom-panel-left');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  console.log("Device is ready!");
});

$$('#button').on('click', function() {
  // $('#logincontent').load("");
  // var win = cordova.InAppBrowser;
  // win.open('http://192.168.1.24:4000/login', '_self', 'location=true');

  // win.addEventListener("loadstop", function() {
  //   setTimeout(function() {
  //     win.close();
  //   }, 5000);
  // });
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):

myApp.onPageInit('GamesHome', function(page) {
  // Do something here for "about" page
  myApp.closePanel();
  var s = document.getElementsByTagName('script')[0];
  var sc = document.createElement('script');
  sc.type = 'text/javascript';
  sc.async = false;
  sc.src = 'Menu/Games/GamesHome.js';
  s.parentNode.insertBefore(sc, s);
});

myApp.onPageInit('730', function(page) {
  // Do something here for "about" page
  myApp.closePanel();
  var s = document.getElementsByTagName('script')[0];
  var sc = document.createElement('script');
  sc.type = 'text/javascript';
  sc.async = false;
  sc.src = 'Menu/Games/730/730.js';
  s.parentNode.insertBefore(sc, s);
});
