// Initialize Firebase
var config = {
    apiKey: "AIzaSyC25cL7RR9HzRf6aTsqkjrGokb2b_gN27c",
    authDomain: "geolert-208617.firebaseapp.com",
    databaseURL: "https://geolert-208617.firebaseio.com",
    projectId: "geolert-208617",
    storageBucket: "geolert-208617.appspot.com",
    messagingSenderId: "281706122044"
};
firebase.initializeApp(config);

// Reference messages collection
var messagesRef = firebase.database().ref("messages");

// Listen for form submit
document.getElementById("geolertForm").addEventListener("submit", submitForm);

// Submit form
function submitForm(e){
      e.preventDefault();

    // Get values from form
    var name = getInputVal("scoutName");
    var message = getInputVal("geolert");
    var email = getInputVal("hqEmail");

    console.log(name);
    console.log(message);
    console.log(email);

    // Save message
    saveMessage(name, message, email);

    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://serene-gorge-23173.herokuapp.com/sendmail",
        method: "POST",
        data: {
            recipient: email,
            subject: "GeoLert from " + name,
            message: message,
            mailerKiy: "dr0w55@P!"
        }
    }).then(function(res){
    });

    // var link = 'mailto:' + email + '?subject=GeoLert from '+ name +'&body=' + message;
    // window.location.href = link;

    console.log("I've been sent!");

    // Show alert
    document.querySelector(".alert-div").style.display = "block";
    document.getElementById("geolertReceive").innerHTML = name + " says " + message;

    // Hide alert after 10 seconds
    setTimeout(function(){
        document.querySelector(".alert-div").style.display = "none";
    },10000);

    // Clear form
    document.getElementById("geolertForm").reset();
}

// Function to get form values
function getInputVal(id){
    return document.getElementById(id).value;
}

// Saves message to Firebase as object
function saveMessage(name, message, email){
     var newMessageRef = messagesRef.push();
     newMessageRef.set({
         name: name,
         message: message,
         email: email,
     });
}