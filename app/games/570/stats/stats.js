function Stats() {

    var appID = 570;

    function Initialise() {
    	GetGameDetails(appID, ProcessGameData);
    }

    function GetGameDetails(appID, callback) {
        $.ajax({
            url: 'http://localhost:4000/steam/' + appID,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                callback(data, appID);
            }
        });
    }

    function ProcessGameData(data, gameid) {
        var tmpJSON = JSON.parse(data);
        var gameData = tmpJSON[gameid];
        var gameName = gameData.data.name;
        var gameImage = gameData.data.header_image;

        $("#game_name").text(gameName);
        $("#game_image").attr('src', gameImage);
    }

    return {
        init: function() {
            Initialise();
        }
    }
}

$(document).ready(function() {
    var statsObj = new Stats();
    statsObj.init();
})