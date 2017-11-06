function Main() {

    var supportedGameArray = [730, 570, 578080, 433850, 386360, 440, 252950, 107410, 476600];

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
                <div class="panel-heading" style="background-image: linear-gradient(to bottom, #3c3c3c 0%, #222 100%); text-align: center;">${gameName}</div>
                <div class="panel-body"><img src="${gameImage}" class="img-responsive" style="width:100%" alt="Image"></div>
                <div class="panel-footer">
                    <button class="btn btn-primary" id="stats_${gameid}">Stats</button>
                </div>
            </div>
        </div>`;

        $("#mainpage").append(html);

        $("#stats_" + gameid).on("click", function() {
            $("#mainpage").load("games/" + gameid + "/stats/stats.html");
        })
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
