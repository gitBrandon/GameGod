function Login() {

    function Initialise() {
        RegisterEvents();
    }

    function Login(callback) {
        var username = $("#user").val();
        var password = $("#pwd").val();

        $.ajax({
            url: 'http://localhost:4000/login/' + username + '/' + password,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                callback(data);
            }
        });
    }

    function ProcessLogin(data) {
    	if(data.recordset.length > 0) {
    		document.cookie = "userID=" + data.recordset[0].ID;
    		document.cookie = "userName=" + data.recordset[0].Username;
    		window.location.href += "app/main.html";
    	}
    	else {
    		alert("User not found")
    	}
    }

    function RegisterEvents() {
        $("#btn_login").on("click", function() {
        	Login(ProcessLogin)
        });
    }

    return {
        init: function() {
            Initialise();
        }
    }
}

$(document).ready(function() {
	var loginObj = new Login();
	loginObj.init();
})