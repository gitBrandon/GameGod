function Main() {

    var supportedGameArray = [730, 570, 578080, 433850, 440];
    var _selectedItem;

    function Initialise() {
        ProcessUser();
        $(supportedGameArray).each(function(idx, el) {
            GetSupportedGameDetails(el, BuildGameBlocks)
        })
        _selectedItem = $("#games");
        $("#games").addClass('active');
        RegisterEvents();
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    function ProcessUser() {
        var userName = getCookie("userName");

        $("#user_name").text("Welcome " + userName);
    }

    function GetSupportedGameDetails(gameid, callback) {
        $.ajax({
            url: 'http://localhost:4000/steam/' + gameid,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                callback(data, gameid);
            }
        });
    }

    function BuildGameBlocks(data, gameid) {
        var tmpJSON = JSON.parse(data);
        var gameData = tmpJSON[gameid];

        var gameName = gameData.data.name;
        var gameImage = gameData.data.header_image;
        var gameBackgroundImage = gameData.data.background;

        var html = `
        <div class="col-sm-4">
            <div class="panel panel-primary" style="border-color: black;">
                <div class="panel-heading" style="text-align: center; border-color: black; background-image: linear-gradient(to bottom, #3c3c3c 0%, #222 100%);">${gameName}</div>
                <div class="panel-body" style="background-image: url(${gameBackgroundImage});"><img src="${gameImage}" class="img-responsive" style="width:100%" alt="Image"></div>
                <div class="panel-footer" style="background-image: linear-gradient(to bottom, #3c3c3c 0%, #222 100%); border-color: black; background-color: black;">
                    <button class="btn btn-primary" id="stats_${gameid}">Stats <i class="glyphicon glyphicon-stats"></i></button>
                    <button class="btn btn-primary" id="betting_${gameid}">Predictions <i class="fa fa-money  "></i></button>
                    <button class="btn btn-primary" id="stats_${gameid}">Store <i class="fa fa-shopping-cart"></i></button>
                    <button class="btn btn-primary" id="stats_${gameid}">Trade <i class="fa fa-exchange"></i></button>
                </div>
            </div>
        </div>`;

        $("#mainpage").append(html);

        $("#stats_" + gameid).on("click", function() {
            $("#mainpage").load("games/" + gameid + "/stats/stats.html");
        })

        $("#betting_" + gameid).on("click", function() {
            $("#mainpage").load("games/" + gameid + "/betting/betting.html");
        })
    }

    function RegisterEvents() {
        $(".list-item").on("click", function() {
            var self = this;

            $(_selectedItem).removeClass('active');
            _selectedItem = $(self);
            $(_selectedItem).addClass('active');
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