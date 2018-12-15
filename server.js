// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();  
// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.Promise = Promise;
if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true
    });
}
else {
    mongoose.connect("mongodb://127.0.0.1:27017/newsdb", {
      useNewUrlParser: true
    });
}

// Routes

require("./controllers/apiRoutes.js")(app);

// Start the server
mongoose.connection.on('error', function(err) {
    console.log("Mongoose Error: " + err);
})

mongoose.connection.on('open', function() {
    console.log("Mongoose connection successful.");
    app.listen(PORT, function() {
        console.log(`App is running on port ${PORT}!`);
    });
});
