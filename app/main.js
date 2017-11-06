function Main() {

    var supportedGameArray = [730, 570];

    function Initialise() {
        $(supportedGameArray).each(function(idx, el) {
            GetSupportedGameDetails(el, BuildGameBlocks)
        })
    }

    function GetSupportedGameDetails(gameid, callback) {
        $.ajax({

            url: 'http://store.steampowered.com/api/appdetails?appids=' + gameid,
            type: 'GET',
            headers: { 'Access-Control-Allow-Origin': '*' },
            success: function(data) {
                callback(data);
            }
        });

        function setHeader() {
        	xhr.setRequestHeader('Authorization', token);
        } 
    }

    function BuildGameBlocks(data) {
        console.log(data);
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