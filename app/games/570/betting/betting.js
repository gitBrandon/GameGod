function Betting() {

    var appID = 570;
    var _gameCount = 0;

    function Initialise() {
        GetGameDetails(appID, ProcessGameData);
        GetMatchData(ProcessMatchData);
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

        var gameBackgroundImage = gameData.data.background;

        $('body').css('background-image', 'url(' + gameBackgroundImage + ')');
    }

    function GetMatchData(callback) {
        $.ajax({
            url: 'https://api.opendota.com/api/proMatches',
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                callback(data);
            }
        });
    }

    function ProcessMatchData(data) {
        for (var i = 0; i < 7; i++) {
        	ExtractAndBuild(data[i]);
        }
    }

    function ExtractAndBuild(data) {
    	var radiantID = data.radiant_team_id;
    	var direID = data.dire_team_id;

    	var matchData = {
    		matchData: data
    	}

    	function ProcessRadiantData(radData) {
    		matchData["RadiantTeamData"] = radData;

    		function ProcessDireData(direData) {
    			matchData["DireTeamData"] = direData;

    			BuildMatchItem(matchData);
    		}

    		GetDireTeamData(direID, ProcessDireData)
    	}

    	GetRadiantTeamData(radiantID, ProcessRadiantData);
    }

    function BuildMatchItem(data) {

        var radData = JSON.parse(data.RadiantTeamData);
        var direData = JSON.parse(data.DireTeamData);

        console.log(data.matchData);

        var html = `
        <div class="col-sm-4">
            <div class="panel panel-primary" style="border-color: black;">
                <div class="panel-heading" style="text-align: center; border-color: black; background-image: linear-gradient(to bottom, #3c3c3c 0%, #222 100%);">
                	<h4>${data.matchData.league_name}</h4>
                </div>
                <div class="panel-body" style="color: white; padding: 0px;">
                	<div class="radiant-side col-xs-6" style="padding: 5px;">
                		<h4>${radData.name}</h4>
                		<img style="display: inline; width: 100%; height: 180px; border: 1px solid black; border-radius: 8px; background: white;" class="img-responsive" src="${radData.logo_url}">
                	</div>
                	<div class="dire-side col-xs-6" " style="padding: 5px;">
                		<h4>${direData.name}</h4>
                		<img style="display: inline; width: 100%; height: 180px; border: 1px solid black; border-radius: 8px; background: white;" class="img-responsive" src="${direData.logo_url}">
                	</div>
                </div>
                <div class="panel-footer" style="padding-left: 40%; display: -webkit-box; background-image: linear-gradient(to bottom, #3c3c3c 0%, #222 100%); border-color: black; background-color: black;">
                    <button class="btn btn-primary">Make Prediction</button>
                </div>
            </div>
        </div>`;

        $("#match_holder").append(html);
    }

    function GetRadiantTeamData(teamID, callback) {
        $.ajax({
            url: 'http://localhost:4000/dota2api/teams/' + teamID,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                callback(data);
            }
        });
    }

    function GetDireTeamData(teamID, callback) {
        $.ajax({
            url: 'http://localhost:4000/dota2api/teams/' + teamID,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                callback(data);
            }
        });
    }

    return {
        init: function() {
            Initialise();
        }
    }
}

$(document).ready(function() {
    var bettingObj = new Betting();
    bettingObj.init();
})