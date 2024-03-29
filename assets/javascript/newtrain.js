$(document).ready(function() {


  // 1. Initialize Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyD2Dru1VmnVORokk_VmqXsS8iYM8dyLq5M",
    authDomain: "trainscheduler-5a82a.firebaseapp.com",
    databaseURL: "https://trainscheduler-5a82a.firebaseio.com",
    projectId: "trainscheduler-5a82a",
    storageBucket: "",
    messagingSenderId: "504240268643",
    appId: "1:504240268643:web:bbc4a48064ae9d61"
  };

  
  
  firebase.initializeApp(firebaseConfig);

  // Create a variable to reference the database
var database = firebase.database();

// Create an on click function that adds trains to the top table
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // create variables with the user input from form
  var trnName = $("#train-name-input").val().trim();
  var trnDest = $("#destination-input").val().trim();
  var firstTrnTime = $("#first-train-input").val().trim();
  var trnFreq = $("#frequency-input").val().trim();

  // create a temporary object for holding the new train data
  var newTrn = {
    name: trnName,
    destination: trnDest,
    firstTime: firstTrnTime,
    frequency: trnFreq
  };

  

  // upload the new train data to the database
  database.ref().push(newTrn);

  // console log the values that were just pushed to the database
  console.log(newTrn.name);
  console.log(newTrn.destination);
  console.log(newTrn.firstTime);
  console.log(newTrn.frequency);

  // clear the form values after values have been stored
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// create a firebase event for adding the data from the new trains and then populating them in the DOM.
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  // store snapshot changes in variables
  var trnName = childSnapshot.val().name;
  var trnDest = childSnapshot.val().destination;
  var firstTrnTime = childSnapshot.val().firstTime;
  var trnFreq = childSnapshot.val().frequency;

  // log the values
  console.log(trnName);
  console.log(trnDest);
  console.log(firstTrnTime);
  console.log(trnFreq);

  
  // process for calculating the Next Arrival and Minutes Away fields...
  // make sure the first train time is after the eventual current time
  var firstTrnTimeConv = moment(firstTrnTime, "hh:mm a").subtract(1, "years");
  // store variable for current time
  var currentTime = moment().format("HH:mm a");
  console.log("Current Time:" + currentTime);
  // store variable for difference of current time and first train time
  var trnTimeCurrentTimeDiff = moment().diff(moment(firstTrnTimeConv), "minutes");
  // store the time left
  var timeLeft = trnTimeCurrentTimeDiff % trnFreq;
  // calculate and store the minutes until next train arrives
  var minutesAway = trnFreq - timeLeft;
  // calculate the next arriving train
  var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

  // add the data into the DOM/html
  $("#train-table > tbody").append("<tr><td>" + trnName + "</td><td>" + trnDest + "</td><td>" + trnFreq + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});
});
