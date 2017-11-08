var myApp = new Framework7();
var $$ = Dom7;

var app_id = 730;

var GetAppInfo = function() {
  $$.ajax({
    url: 'http://192.168.1.24:4000/steam/' + app_id,
    method: 'GET',
    dataType: 'JSON',
    success: function(data) {
      var data = JSON.parse(data);
      SetPage(data);
    }
  })
}

var SetPage = function(data) {
  var tmpJSON = JSON.parse(data);
  var gameData = tmpJSON[app_id];

  console.log(gameData)

  var gameBackground = gameData.data.background;
  $$('.CSGOPAGE').css('background-image', 'url(' + gameBackground + ')');
  $$('.CSGOPAGE').css('background-repeat', 'no-repeat');
  $$('.CSGOPAGE').css('background-size', 'cover');
  $$('.CSGOPAGE').css('background-position', 'left');

  $$.each(gameData.data.achievements.highlighted, function(index, value) {
    if(value != undefined)
    {
      var html = `<li>
        <div class="item-content">
          <div class="item-media">
            <img src="${value.path}" width='80'>
          </div>
          <div class="item-inner">
            <div class="item-title-row">
              <div class="item-title">${value.name}</div>
            </div>
          </div>
        </div>
      </li>`
    }

    $$('.game-achievements').append(html);
  })

}

var Init = function() {
  GetAppInfo();

  $$('#achBtn').on('click', function (e) {
      $('.achievements-container').show();
  });
}

Init();
