function Main() {

    var supportedGameArray = [730, 570, 578080, 433850];

    function Initialise() {
        $(supportedGameArray).each(function(idx, el) {
            GetSupportedGameDetails(el, BuildGameBlocks)
        })
    }

    function GetSupportedGameDetails(gameid, callback) {
        $.ajax({
            url: 'http://localhost:4000/steam/' + gameid,
            type: 'GET',
            dataType : 'JSON',
            success: function(data) {
                callback(data, gameid);
            }
        });
    }

    function BuildGameBlocks(data, gameid) {
        var tmpJSON = JSON.parse(data);
        var gameData = tmpJSON[gameid];

        console.log(gameData);

        var gameName = gameData.data.name;
        var gameImage = gameData.data.header_image;

        var html = `
        <div class="col-sm-4">
            <div class="panel panel-primary">
                <div class="panel-heading">${gameName}</div>
                <div class="panel-body"><img src="${gameImage}" class="img-responsive" style="width:100%" alt="Image"></div>
                <div class="panel-footer"></div>
            </div>
        </div>`;

        $("#gameHolder").append(html)
    }

    return {
        init: function() {
            Initialise();
        }
    }
}

$(document).ready(function() {
    var mainObj = new Main();
    mainObj.init();
})
