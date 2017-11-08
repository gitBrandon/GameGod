function Main() {

    var supportedGameArray = [730, 570];

    function Initialise() {
        $(supportedGameArray).each(function(idx, el) {
            GetSupportedGameDetails(el, BuildGameBlocks)
        })
    }

    function GetSupportedGameDetails(gameid, callback) {
        $.ajax({

            url: 'http://localhost:4000/steam/' + gameid,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log(data);
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