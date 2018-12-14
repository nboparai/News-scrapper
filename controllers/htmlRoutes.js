// html-routes.js
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
    app.get("/" , function(req, res) {
        res.render('index');
    });

    app.get("/saved", function(req, res) {
        // get saved articles from database
        // then render teh saved article in the view using handlebars
    })
}