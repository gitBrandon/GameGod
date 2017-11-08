var myApp = new Framework7();
var $$ = Dom7;

var supportedGameArray = [730, 570, 578080, 433850, 386360, 440, 252950, 107410, 476600];

function BuildGameBlocks(data, gameid) {
  var tmpJSON = JSON.parse(data);
  var gameData = tmpJSON[gameid];

  var gameName = gameData.data.name;
  var gameImage = gameData.data.header_image;
  var gameWebsite = gameData.data.website;
  var gameBackground = gameData.data.background;

    var html = `
    <li style='background: url(`+ gameBackground  +`); background-repeat: no-repeat; background-position: left; background-size: cover;'>
      <a href="Menu/Games/`+ gameid +`/`+ gameid +`.html" class="item-link item-content">
        <div class="item-media"><img src='${gameImage}' width='80'></div>
        <div class="item-inner">
          <div class="item-title-row">
            <div class="item-title" style='color:white;'>${gameName}</div>
          </div>
          <div class="item-text">${gameWebsite}</div>
        </div>
      </a>
    </li>`;

    $$('#games-list').append(html);
}

var GetGames = function(gameid) {
  if(gameid != undefined)
  {
    $$.ajax({
      url: 'http://192.168.1.24:4000/steam/' + gameid,
      method: 'GET',
      dataType : 'JSON',
      success:function(data) {
        var data = JSON.parse(data);
        BuildGameBlocks(data, gameid)
      }
    })
  }
}

$$.each(supportedGameArray, function (index, value) {
    GetGames(value)
});



var Init = function() {
  GetGames();
}
Init();
