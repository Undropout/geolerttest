var config = {
    apiKey: config.apiKey_2,
    authDomain: config.authDomain_2,
    databaseURL: config.databaseURL_2,
    storageBucket: config.storageBucket_2,
    messagingSenderId: config.messagingSenderId_2
};
var lat;
console.log("This is your config variable: " + config);
firebase.initializeApp(config);

var database = firebase.database();
console.log("This is your database: " + database);

database.ref().on("child_added", function (snapshot) {


    var testTable = $("#data-table");

    var newRow = $('<tr>');
    //attempting to do a new variable that'll populate with a mostly-complete URL in a href, so when coordinates come back from the Firebase server we can put them into a link by DOM manipulation

    var newName = $('<td>');
    // var newUserType = $('<td>');
 //Commented out as unnecessary   var newUserEmail = $('<td>');
    var newRecipient = $('<td>');
    //var newTriggerLocation = $('<td>');
    //^ This has been temporarily commented out to allow an experiment in DOM manipulation below with the variable "newLoc"
    var newLoc = $('<td>');
    var newMessage = $('<td>');

    newName.html(snapshot.val().userName);
    // newUserType.html(snapshot.val().userType);
 //Commented out as unnecessary   newUserEmail.html(snapshot.val().userEmail);
    newRecipient.html(snapshot.val().recipient);
    //newTriggerLocation.html(snapshot.val().triggerLocation);
    //^ Commented out to allow for DOM manipulation experiment below
    // if (snapshot.val().userType == 'Scout') {
    //     newLoc.html('<a href = "https://www.google.com/maps/?q=' + snapshot.val().triggerLocation + '">Location');
    //     newMessage.html(snapshot.val().message);
    // }
    // if (snapshot.val().userType == 'HQ') {
    //     newLoc.html('');
    // }

    newRow.append(newName);
    // newRow.append(newUserType);
//Commented out as unnecessary    newRow.append(newUserEmail);
    newRow.append(newRecipient);
    newRow.append(newLoc);
    newRow.append(newMessage);


    testTable.append(newRow);

});
//-=-=-=-=-=-=-=-
//Function to show or hide entry fields depending on whether user is HQ or Scout type
// $("#newUserType").bind('change', function () {

//     var whatUserType = $(this).find(':selected').text();
//     console.log(whatUserType);
//     //If they're HQ, 3 fields will disappear so they don't enter anything they're not supposed to
//     if (whatUserType == "HQ") {
//         document.getElementById("newRecipient").style.display = 'none';
//         document.getElementById("recipientLabel").style.display = 'none';
//         document.getElementById("newTriggerLocation").style.display = 'none';
//         document.getElementById("newMessage").style.display = 'none';
//     }
//     //If they're a scout, the ability to access those 3 fields comes back
//     if (whatUserType == "Scout") {
//         document.getElementById("newRecipient").style.display = 'block';
//         document.getElementById("recipientLabel").style.display = 'none';
//         document.getElementById("newTriggerLocation").style.display = 'block';
//         document.getElementById("newMessage").style.display = 'block';
//     }
// });
//-=-=-=-=-=-=-=-


$('#getAddress').on("click", function (e) {
    e.preventDefault();

    console.log(marker);
    var latlng = marker.getPosition();
    lat = latlng.lat();
    long = latlng.lng();

    console.log("Lat: ", lat, "Long: ", long);
    $(document).on("click", map, function () {
        $("#latlngInput").val("");
        $("#latlngInput").val(lat + "," + long);
    })
});

$('#submitNewUser').on("click", function (e) {
    e.preventDefault();

    var inputUser = $('#newUserName').val().trim();
    // var inputUserType = $('#newUserType').val();
 //Commented out as unnecessary   var inputUserEmail = $('#newUserEmail').val();
    var inputRecipient = $('#newRecipient').val();
    var inputTriggerLocation = $('#latlngInput').val();
    var inputMessage = $('#newMessage').val();
    console.log("User name entered is: " + inputUser);
    // console.log("User type is: " + inputUserType);
    console.log("the message that should display is: " + inputMessage);
    
    //attempting listener to only send email when we hit the trigger loc
    //attempting listener to only send email when we hit the trigger loc
    //attempting listener to only send email when we hit the trigger loc
    var id, options;

    function success(pos) {
      var crd = pos.coords;
    console.log ("Target latitude is: " + lat);
    console.log ("Current latitude is: " + crd.latitude);
    console.log ("Target longitude is: " + long);
    console.log ("Current longitude is: " + crd.longitude);

      if (lat > (crd.latitude-.001) && lat < (crd.latitude + .001) && long >(crd.longitude - .001) && long < (crd.longitude + .001)) {
        console.log('Congratulations, you reached the target. Sending mail now.');
        ///Push the data to the mailer
        $.ajax({

            url: "https://cors-anywhere.herokuapp.com/https://serene-gorge-23173.herokuapp.com/sendmail",
            method: "POST",
            data: {
                recipient: inputRecipient,
                subject: "GeoLert from " + inputUser,
                message: inputMessage + "<br>(Location:  https://www.google.com/maps/?q=" + inputTriggerLocation + ")",
                mailerKiy: "dr0w55@P!"
            }
        }).then(function(res){
        });
        ///^Pushes the data to the mailer
        navigator.geolocation.clearWatch(id);
      }
    }
    
    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }
    
    target = {
      latitude : 0,
      longitude: 0
    };
    
    options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };
    
    id = navigator.geolocation.watchPosition(success, error, options);
//end the trigger loc listener thing
//end the trigger loc listener thing
//end the trigger loc listener thing



    // var link = 'mailto:' + email + '?subject=GeoLert from '+ name +'&body=' + message;
    // window.location.href = link;

    console.log("I've been sent!");


    // }
    if (inputUser.length > 0 && inputRecipient.length > 0) {
        database.ref().push({
            userName: inputUser,
            // userType: inputUserType,
  //Commented out as unnecessary          userEmail: inputUserEmail,
            recipient: inputRecipient,
            triggerLocation: inputTriggerLocation,
            message: inputMessage
        });
    }
    //clears the input form; later we'll change this to repopulate with localstorage values so the same user doesn't have to input their info every time.
    $("#newUserName").val("");
    // $("#newUserType").val("");
//Commented out as unnecessary    $("#newUserEmail").val("");
    $("#newRecipient").val("");
    $("#latlngInput").val("");
    $("#newMessage").val("");

});