// Initialize Firebase
var config = {
    apiKey: "AIzaSyDTYdpg8ioGj9udlEji5U23CVbr8EwEzgI",
    authDomain: "st-project-88e61.firebaseapp.com",
    databaseURL: "https://st-project-88e61.firebaseio.com",
    projectId: "st-project-88e61",
    storageBucket: "st-project-88e61.appspot.com",
    messagingSenderId: "1048264981129"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        frequency: trainFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    // console.log(newTrain.name);
    // console.log(newTrain.destination);
    // console.log(newTrain.start);
    // console.log(newTrain.frequency);

    // Alert
    // alert("Train successfully added");

    // Clears all of the text-boxes
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    // console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().frequency;

    // Prettify the train start time
    var trainStartPretty = moment.unix(trainStart).format("hh:mm A");

    // Train Info
    console.log("TRAIN NAME:" + trainName);
    console.log("DESTINATION: " + trainDestination);
    console.log("FIRST TRAIN TIME: " + trainStartPretty);
    console.log("COMES EVERY " + trainFrequency + " MINUTES");

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment.unix(trainStart, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

    // Difference in between times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    // console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    var trainArrival = moment(nextTrain).format("hh:mm A");

    // console.log("ARRIVAL TIME: " + trainArrival);

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
        trainFrequency + "</td><td>" + trainArrival + "</td><td>" + tMinutesTillTrain + "</td><td>");
});